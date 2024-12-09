package itmo.is.lab1.yaml_import.service;

import java.io.IOException;
import java.io.InputStream;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Pageable;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.web.multipart.MultipartFile;
import org.yaml.snakeyaml.Yaml;

import io.minio.MinioClient;
import io.minio.PutObjectArgs;
import io.minio.errors.MinioException;
import itmo.is.lab1.Pagification;
import itmo.is.lab1.coordinates.dao.CoordinatesRepository;
import itmo.is.lab1.coordinates.model.Coordinates;
import itmo.is.lab1.location.dao.LocationRepository;
import itmo.is.lab1.location.model.Location;
import itmo.is.lab1.movie.dao.MovieRepository;
import itmo.is.lab1.movie.model.Movie;
import itmo.is.lab1.movie.model.MovieGenre;
import itmo.is.lab1.movie.model.MpaaRating;
import itmo.is.lab1.person.dao.PersonRepository;
import itmo.is.lab1.person.model.Color;
import itmo.is.lab1.person.model.Country;
import itmo.is.lab1.person.model.Person;
import itmo.is.lab1.user.dao.UserRepository;
import itmo.is.lab1.user.model.Role;
import itmo.is.lab1.user.model.User;
import itmo.is.lab1.utils.exceptions.CoordinatesAlreadyExistException;
import itmo.is.lab1.utils.exceptions.LocationAlreadyExistException;
import itmo.is.lab1.utils.exceptions.MovieAlreadyExistException;
import itmo.is.lab1.utils.exceptions.PersonAlreadyExistException;
import itmo.is.lab1.yaml_import.dao.ImportHistoryRepository;
import itmo.is.lab1.yaml_import.dto.ImportHistoryDTO;
import itmo.is.lab1.yaml_import.model.ImportHistory;
import itmo.is.lab1.yaml_import.model.OperationStatus;
import itmo.is.lab1.security.jwt.JwtUtils;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(isolation = Isolation.SERIALIZABLE)
public class ImportService {
   private final CoordinatesRepository coordinatesRepository;
   private final LocationRepository locationRepository;
   private final UserRepository userRepository;
   private final PersonRepository personRepository;
   private final MovieRepository movieRepository;
   private final ImportHistoryRepository importHistoryRepository;
   private final SimpMessagingTemplate simpMessagingTemplate;
   private final JwtUtils jwtUtils;
   private int importedCount = 0;
   private final MinioClient minioClient;

   public void importFile(MultipartFile file, HttpServletRequest request) throws Exception {
      importedCount = 0;
      User user = findUserByRequest(request);

      ImportHistory importHistory = ImportHistory.builder().user(user).build();
      String userFileName = user.getUsername() +"_" + System.currentTimeMillis() + "/" + file.getOriginalFilename();

      try {
         try (InputStream inputStream = file.getInputStream()) {
            minioClient.putObject(
                  PutObjectArgs.builder()
                        .bucket("romariok-drive")
                        .object(userFileName)
                        .stream(inputStream, file.getSize(), -1)
                        .contentType(file.getContentType())
                        .build());
         }
         String fileUrl = minioClient.getPresignedObjectUrl(
               io.minio.GetPresignedObjectUrlArgs.builder()
                     .method(io.minio.http.Method.GET)
                     .bucket("romariok-drive")
                     .object(userFileName)
                     .build());
         importHistory.setFileUrl(fileUrl);
      } catch (MinioException e) {
         throw new Exception("Error uploading file to MinIO: " + e.getMessage());
      }

      try (InputStream inputStream = file.getInputStream()) {
         Yaml yaml = new Yaml();
         HashMap<String, List<HashMap<String, Object>>> data = yaml.load(inputStream);

         if (data.containsKey("coordinates")) {
            List<HashMap<String, Object>> coordinatesList = data.get("coordinates");
            if (coordinatesList == null) {
               throw new IllegalArgumentException("Coordinates list is empty");
            }
            for (HashMap<String, Object> coordData : coordinatesList) {
               parseAndSaveCoordinate(coordData, user, false);
            }
         }
         if (data.containsKey("locations")) {
            List<HashMap<String, Object>> locationsList = data.get("locations");
            if (locationsList == null) {
               throw new IllegalArgumentException("Locations list is empty");
            }
            for (HashMap<String, Object> locationData : locationsList) {
               parseAndSaveLocation(locationData, user, false);
            }
         }
         if (data.containsKey("persons")) {
            List<HashMap<String, Object>> personsList = data.get("persons");
            if (personsList == null) {
               throw new IllegalArgumentException("Persons list is empty");
            }
            for (HashMap<String, Object> personData : personsList) {
               parseAndSavePerson(personData, user, false);
            }
         }

         if (data.containsKey("movies")) {
            List<HashMap<String, Object>> moviesList = data.get("movies");
            if (moviesList == null) {
               throw new IllegalArgumentException("Movies list is empty");
            }
            for (HashMap<String, Object> movieData : moviesList) {
               parseAndSaveMovie(movieData, user);
            }
         }
         simpMessagingTemplate.convertAndSend("/topic", "Import completed");
         importHistory.setImportedCount(importedCount);
         importHistory.setStatus(OperationStatus.SUCCESS);
         importHistory.setImportTime(LocalDateTime.now());
         importHistoryRepository.save(importHistory);
      } catch (Exception e) {
         try {
            minioClient.removeObject(
                  io.minio.RemoveObjectArgs.builder()
                        .bucket("romariok-drive")
                        .object(userFileName)
                        .build());
            minioClient.removeObject(io.minio.RemoveObjectArgs.builder().bucket("romariok-drive")
                  .object(userFileName.substring(0, userFileName.lastIndexOf('/'))).build());
         } catch (Exception ex) {
            System.err.println("Failed to delete file from MinIO after rollback: " + ex.getMessage());
         }
         throw e;
      }

   }

   private Coordinates parseAndSaveCoordinate(HashMap<String, Object> coordData, User user, boolean inner) {
      if (!coordData.containsKey("x") || !coordData.containsKey("adminCanModify")) {
         throw new IllegalArgumentException("Coordinate data is missing. X and adminCanModify are required");
      }

      Double x;
      try {
         if (coordData.get("x") == null) {
            throw new IllegalArgumentException("X coordinate cannot be null");
         }
         x = ((Number) coordData.get("x")).doubleValue();
      } catch (ClassCastException e) {
         throw new IllegalArgumentException("Invalid data type for x coordinate. Expected a Double.", e);
      }
      Optional<Long> y = Optional.empty();
      if (coordData.containsKey("y")) {
         try {
            if (coordData.get("y") == null) {
               throw new IllegalArgumentException("Y coordinate cannot be null");
            }
            y = Optional.of(((Number) coordData.get("y")).longValue());
         } catch (ClassCastException e) {
            throw new IllegalArgumentException("Invalid data type for y coordinate. Expected a Long.", e);
         }
      }
      Boolean adminCanModify = parseAdminCanModify(coordData, user);

      Coordinates coordinate = new Coordinates();
      if (x > 500 || x < -500) {
         throw new IllegalArgumentException("X coordinate is out of bounds: " + x);
      }
      coordinate.setX(x);
      if (y.isPresent()) {
         if (y.get() > 500 || y.get() < -500) {
            throw new IllegalArgumentException("Y coordinate is out of bounds: " + y.get());
         }
         coordinate.setY(y.get());
      } else {
         coordinate.setY(0);
      }

      coordinate.setAdminCanModify(adminCanModify);
      coordinate.setUser(user);

      if (coordinatesRepository.existsByXAndY(
            coordinate.getX(),
            coordinate.getY())) {
         if (!inner) {
            throw new CoordinatesAlreadyExistException(String.format("Coordinates %.3f %d already exist",
                  coordinate.getX(), coordinate.getY()));
         } else {
            System.out.println("Coordinates already exists. Returning existing coordinates");
            return coordinatesRepository.findByXAndY(coordinate.getX(), coordinate.getY());
         }
      }

      coordinatesRepository.save(coordinate);
      incrementImportedCount();
      return coordinate;
   }

   private Location parseAndSaveLocation(HashMap<String, Object> locationData, User user, boolean inner) {
      if (!locationData.containsKey("name") || !locationData.containsKey("x")
            || !locationData.containsKey("z") || !locationData.containsKey("adminCanModify")) {
         throw new IllegalArgumentException("Location data is missing. Name, x, z and adminCanModify are required");
      }

      if (locationData.get("name") == null) {
         throw new IllegalArgumentException("Location name cannot be null");
      }
      String name = locationData.get("name").toString();
      Double x;
      try {
         if (locationData.get("x") == null) {
            throw new IllegalArgumentException("X coordinate in location cannot be null");
         }
         x = ((Number) locationData.get("x")).doubleValue();
      } catch (ClassCastException e) {
         throw new IllegalArgumentException("Invalid data type for x coordinate in location. Expected a Double.", e);
      }
      Optional<Long> y = Optional.empty();
      if (locationData.containsKey("y")) {
         try {
            if (locationData.get("y") == null) {
               throw new IllegalArgumentException("Y coordinate in location cannot be null");
            }
            y = Optional.of(((Number) locationData.get("y")).longValue());
         } catch (ClassCastException e) {
            throw new IllegalArgumentException("Invalid data type for y coordinate in location. Expected a Long.", e);
         }
      }
      Integer z;
      try {
         if (locationData.get("z") == null) {
            throw new IllegalArgumentException("Z coordinate in location cannot be null");
         }
         z = ((Number) locationData.get("z")).intValue();
      } catch (ClassCastException e) {
         throw new IllegalArgumentException("Invalid data type for z coordinate in location. Expected an integer.", e);
      }
      Boolean adminCanModify = parseAdminCanModify(locationData, user);

      Location location = new Location();

      if (x > 100 || x < -100) {
         throw new IllegalArgumentException("X coordinate in location is out of bounds: " + x);
      }
      location.setX(x);
      if (y.isPresent()) {
         if (y.get() > 100 || y.get() < -100) {
            throw new IllegalArgumentException("Y coordinate in location is out of bounds: " + y.get());
         }
         location.setY(y.get());
      } else {
         location.setY(0);
      }
      if (z > 100 || z < -100) {
         throw new IllegalArgumentException("Z coordinate in location is out of bounds: " + z);
      }
      location.setZ(z);
      location.setName(name);
      location.setAdminCanModify(adminCanModify);
      location.setUser(user);

      if (inner && locationRepository.existsByXAndYAndZAndName(location.getX(), location.getY(), location.getZ(),
            location.getName())) {
         System.out.println("Location already exists. Returning existing location");
         return locationRepository.findByName(location.getName());
      }

      if (locationRepository.existsByName(location.getName())) {
         throw new LocationAlreadyExistException(String.format("Location %s already exists", location.getName()));
      }
      if (locationRepository.existsByXAndYAndZ(
            location.getX(),
            location.getY(),
            location.getZ())) {
         throw new LocationAlreadyExistException(String.format("Location %.3f %d %d already exists by name %s",
               location.getX(), location.getY(), location.getZ(), location.getName()));
      }
      locationRepository.save(location);
      incrementImportedCount();
      return location;
   }

   @SuppressWarnings("unchecked")

   private Movie parseAndSaveMovie(HashMap<String, Object> movieData, User user) {
      if (!movieData.containsKey("name") || !movieData.containsKey("adminCanModify")
            || !movieData.containsKey("coordinates")
            || !movieData.containsKey("oscarsCount") || !movieData.containsKey("totalBoxOffice")
            || !movieData.containsKey("mpaaRating")
            || !movieData.containsKey("director") || !movieData.containsKey("length")
            || !movieData.containsKey("usaBoxOffice")) {
         throw new IllegalArgumentException(
               "Movie data is missing. Name, adminCanModify, coordinates, oscarsCount, totalBoxOffice, mpaaRating, director, length, and usaBoxOffice are required");
      }

      HashMap<String, Object> coordData = (HashMap<String, Object>) movieData.get("coordinates");
      Coordinates coordinates = parseAndSaveCoordinate(coordData, user, true);

      HashMap<String, Object> directorData = (HashMap<String, Object>) movieData.get("director");
      Person director = parseAndSavePerson(directorData, user, true);
      Person screenwriter = null;
      if (movieData.containsKey("screenwriter")) {
         HashMap<String, Object> screenwriterData = (HashMap<String, Object>) movieData.get("screenwriter");
         screenwriter = parseAndSavePerson(screenwriterData, user, true);
      }
      Person operator = null;
      if (movieData.containsKey("operator")) {
         HashMap<String, Object> operatorData = (HashMap<String, Object>) movieData.get("operator");
         operator = parseAndSavePerson(operatorData, user, true);
      }

      if (movieData.get("name") == null) {

         throw new IllegalArgumentException("Movie name cannot be null");
      }
      String name = movieData.get("name").toString();

      int oscarsCount;
      try {
         if (movieData.get("oscarsCount") == null) {
            throw new IllegalArgumentException("Oscars count cannot be null");
         }
         oscarsCount = ((Number) movieData.get("oscarsCount")).intValue();
      } catch (ClassCastException e) {
         throw new IllegalArgumentException("Invalid data type for oscarsCount. Expected an Integer.", e);
      }

      Double budget = null;
      if (movieData.containsKey("budget")) {
         try {
            if (movieData.get("budget") == null) {
               throw new IllegalArgumentException("Budget cannot be null");
            }
            budget = ((Number) movieData.get("budget")).doubleValue();
         } catch (ClassCastException e) {
            throw new IllegalArgumentException("Invalid data type for budget. Expected a Double.", e);
         }
      }

      long totalBoxOffice;
      try {
         if (movieData.get("totalBoxOffice") == null) {
            throw new IllegalArgumentException("Total box office cannot be null");
         }
         totalBoxOffice = ((Number) movieData.get("totalBoxOffice")).longValue();
      } catch (ClassCastException e) {
         throw new IllegalArgumentException("Invalid data type for totalBoxOffice. Expected a Long.", e);
      }

      MpaaRating mpaaRating;
      try {
         if (movieData.get("mpaaRating") == null) {
            throw new IllegalArgumentException("MPAA rating cannot be null");
         }
         mpaaRating = MpaaRating.valueOf(movieData.get("mpaaRating").toString());
      } catch (IllegalArgumentException e) {
         throw new IllegalArgumentException(
               "Invalid MPAA rating. Must be one of: " + Arrays.toString(MpaaRating.values()), e);
      }

      long usaBoxOffice;
      try {
         if (movieData.get("usaBoxOffice") == null) {
            throw new IllegalArgumentException("USA box office cannot be null");
         }
         usaBoxOffice = ((Number) movieData.get("usaBoxOffice")).longValue();
      } catch (ClassCastException e) {
         throw new IllegalArgumentException("Invalid data type for usaBoxOffice. Expected a Long.", e);
      }

      Long length;
      try {
         if (movieData.get("length") == null) {
            throw new IllegalArgumentException("Length cannot be null");
         }
         length = ((Number) movieData.get("length")).longValue();
      } catch (ClassCastException e) {
         throw new IllegalArgumentException("Invalid data type for length. Expected a Long.", e);
      }

      Long goldenPalmCount = null;
      if (movieData.containsKey("goldenPalmCount")) {
         try {
            if (movieData.get("goldenPalmCount") == null) {
               throw new IllegalArgumentException("Golden palm count cannot be null");
            }
            goldenPalmCount = ((Number) movieData.get("goldenPalmCount")).longValue();
         } catch (ClassCastException e) {
            throw new IllegalArgumentException("Invalid data type for goldenPalmCount. Expected a Long.", e);
         }
      }

      String tagline = null;
      if (movieData.containsKey("tagline")) {
         if (movieData.get("tagline") == null) {
            throw new IllegalArgumentException("Tagline cannot be null");
         }
         tagline = movieData.get("tagline").toString();
      }

      MovieGenre genre = null;
      if (movieData.containsKey("genre")) {
         try {
            if (movieData.get("genre") == null) {
               throw new IllegalArgumentException("Genre cannot be null");
            }
            genre = MovieGenre.valueOf(movieData.get("genre").toString());
         } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid genre. Must be one of: " + Arrays.toString(MovieGenre.values()),
                  e);
         }
      }

      Boolean adminCanModify = parseAdminCanModify(movieData, user);

      Movie movie = new Movie();

      if (oscarsCount < 0) {
         throw new IllegalArgumentException("Oscars count must be non-negative");
      }
      if (length <= 0) {
         throw new IllegalArgumentException("Length must be positive");
      }
      if (usaBoxOffice < 0) {
         throw new IllegalArgumentException("USA box office must be non-negative");
      }
      if (totalBoxOffice < 0) {
         throw new IllegalArgumentException("Total box office must be non-negative");
      }
      if (goldenPalmCount != null && goldenPalmCount < 0) {
         throw new IllegalArgumentException("Golden palm count must be non-negative");
      }
      if (budget != null && budget < 0) {
         throw new IllegalArgumentException("Budget must be non-negative");
      }

      if (movieRepository.existsByName(name)) {
         throw new MovieAlreadyExistException(String.format("Movie %s already exists", name));
      }

      movie.setName(name);
      movie.setCoordinates(coordinates);
      movie.setDirector(director);
      movie.setScreenwriter(screenwriter);
      movie.setOperator(operator);
      movie.setOscarsCount(oscarsCount);
      movie.setBudget(budget);
      movie.setTotalBoxOffice(totalBoxOffice);
      movie.setMpaaRating(mpaaRating);
      movie.setUsaBoxOffice(usaBoxOffice);
      movie.setLength(length);
      movie.setGoldenPalmCount(goldenPalmCount);
      movie.setTagline(tagline);
      movie.setGenre(genre);
      movie.setAdminCanModify(adminCanModify);
      movie.setUser(user);
      movie.setCreationDate(LocalDateTime.now());

      movieRepository.save(movie);
      incrementImportedCount();
      return movie;
   }

   @SuppressWarnings("unchecked")
   private Person parseAndSavePerson(HashMap<String, Object> personData, User user, boolean inner) {
      if (!personData.containsKey("name") || !personData.containsKey("weight")
            || !personData.containsKey("nationality") || !personData.containsKey("eyeColor")
            || !personData.containsKey("location")
            || !personData.containsKey("adminCanModify")) {
         throw new IllegalArgumentException(
               "Person data is missing. Name, weight, nationality, eyeColor, location and adminCanModify are required");
      }

      HashMap<String, Object> locationData = (HashMap<String, Object>) personData.get("location");
      Location location = parseAndSaveLocation(locationData, user, true);

      if (personData.get("name") == null) {
         throw new IllegalArgumentException("Person name cannot be null");
      }
      String name = personData.get("name").toString();
      Long weight;
      try {
         if (personData.get("weight") == null) {
            throw new IllegalArgumentException("Weight cannot be null");
         }
         weight = ((Number) personData.get("weight")).longValue();
      } catch (ClassCastException e) {
         throw new IllegalArgumentException("Invalid data type for weight. Expected a Long.", e);
      }

      Country nationality;
      try {
         if (personData.get("nationality") == null) {
            throw new IllegalArgumentException("Nationality cannot be null");
         }
         nationality = Country.valueOf(personData.get("nationality").toString());
      } catch (IllegalArgumentException e) {
         throw new IllegalArgumentException("Invalid nationality. Must be one of: " + Arrays.toString(Country.values()),
               e);
      }

      Color eyeColor;
      try {
         if (personData.get("eyeColor") == null) {
            throw new IllegalArgumentException("Eye color cannot be null");
         }
         eyeColor = Color.valueOf(personData.get("eyeColor").toString());
      } catch (IllegalArgumentException e) {
         throw new IllegalArgumentException("Invalid eye color. Must be one of: " + Arrays.toString(Color.values()), e);
      }

      Optional<Color> hairColor = Optional.empty();
      if (personData.containsKey("hairColor")) {
         try {
            if (personData.get("hairColor") == null) {
               throw new IllegalArgumentException("Hair color cannot be null");
            }
            hairColor = Optional.of(Color.valueOf(personData.get("hairColor").toString()));
         } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid hair color. Must be one of: " + Arrays.toString(Color.values()),
                  e);
         }
      }

      Boolean adminCanModify = parseAdminCanModify(personData, user);

      Person person = new Person();

      if (weight <= 0) {
         throw new IllegalArgumentException("Weight must be positive");
      }

      person.setWeight(weight);
      person.setEyeColor(eyeColor);
      person.setName(name);
      person.setHairColor(hairColor.orElse(null));
      person.setNationality(nationality);
      person.setLocation(location);
      person.setAdminCanModify(adminCanModify);
      person.setUser(user);

      if (personRepository.existsByNameAndEyeColorAndNationality(person.getName(),
            person.getEyeColor(), person.getNationality())) {
         if (!inner) {
            throw new PersonAlreadyExistException(
                  String.format("Person with name %s, eye color %s, nationality %s already exists",
                        person.getName(), person.getEyeColor(), person.getNationality()));
         } else {
            System.out.println("Person already exists. Returning existing person");
            return personRepository.findByNameAndEyeColorAndNationality(person.getName(), person.getEyeColor(),
                  person.getNationality());
         }
      }

      personRepository.save(person);
      incrementImportedCount();
      return person;
   }

   private Boolean parseAdminCanModify(HashMap<String, Object> data, User user) {
      if (data.get("adminCanModify") == null) {
         throw new IllegalArgumentException("adminCanModify cannot be null");
      }
      String adminCanModifyStr = data.get("adminCanModify").toString();
      if (!adminCanModifyStr.equals("true") && !adminCanModifyStr.equals("false")) {
         throw new IllegalArgumentException("adminCanModify must be true or false");
      }
      return Boolean.parseBoolean(adminCanModifyStr);
   }

   private void incrementImportedCount() {
      importedCount++;
   }

   public List<ImportHistoryDTO> getImportHistory(int from, int size, HttpServletRequest request) {
      User fromUser = findUserByRequest(request);
      Pageable page = Pagification.createPageTemplate(from, size);
      List<ImportHistory> importHistory;

      if (fromUser.getRole() == Role.ADMIN) {
         importHistory = importHistoryRepository.findAll(page).getContent();
      } else {
         importHistory = importHistoryRepository.findAllByUser(fromUser, page).getContent();
      }

      return importHistory
            .stream()
            .map(importHistory1 -> new ImportHistoryDTO(
                  importHistory1.getId(),
                  importHistory1.getStatus(),
                  importHistory1.getImportTime(),
                  importHistory1.getImportedCount(),
                  importHistory1.getUser().getId(),
                  importHistory1.getFileUrl()))
            .sorted(new Comparator<ImportHistoryDTO>() {
               @Override
               public int compare(ImportHistoryDTO o1, ImportHistoryDTO o2) {
                  return o1.getId().compareTo(o2.getId());
               }
            })
            .toList();
   }

   public void deleteImportHistory(Long id, HttpServletRequest request) {
      User fromUser = findUserByRequest(request);

      Optional<ImportHistory> importHistory = importHistoryRepository.findById(id);
      if (importHistory.isEmpty()) {
         throw new IllegalArgumentException("Import history not found by id " + id);
      }
      if (fromUser.getRole() != Role.ADMIN && fromUser.getId() != importHistory.get().getUser().getId()) {
         throw new IllegalArgumentException("Only admins or owner can delete import history");
      }
      importHistoryRepository.deleteById(id);
      simpMessagingTemplate.convertAndSend("/topic", "Import history deleted");
   }

   private User findUserByRequest(HttpServletRequest request) {
      String username = jwtUtils.getUserNameFromJwtToken(jwtUtils.parseJwt(request));
      return userRepository.findByUsername(username)
            .orElseThrow(() -> new UsernameNotFoundException(
                  String.format("Username %s not found", username)));
   }

}
