package itmo.is.lab1.movie.service;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import itmo.is.lab1.Pagification;
import itmo.is.lab1.coordinates.dao.CoordinatesRepository;
import itmo.is.lab1.coordinates.dto.CoordinatesDTO;
import itmo.is.lab1.coordinates.model.Coordinates;
import itmo.is.lab1.location.dto.LocationDTO;
import itmo.is.lab1.movie.dao.MovieRepository;
import itmo.is.lab1.movie.dto.*;
import itmo.is.lab1.movie.model.Movie;
import itmo.is.lab1.movie.model.MovieGenre;
import itmo.is.lab1.person.dao.PersonRepository;
import itmo.is.lab1.person.dto.PersonDTO;
import itmo.is.lab1.person.model.Person;
import itmo.is.lab1.security.jwt.JwtUtils;
import itmo.is.lab1.user.dao.UserRepository;
import itmo.is.lab1.user.model.Role;
import itmo.is.lab1.user.model.User;
import itmo.is.lab1.utils.exceptions.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MovieService {
   private final PersonRepository personRepository;
   private final CoordinatesRepository coordinatesRepository;
   private final UserRepository userRepository;
   private final MovieRepository movieRepository;
   private final JwtUtils jwtUtils;
   private final SimpMessagingTemplate simpMessagingTemplate;

   public List<MovieDTO> getMoviePage(int from, int size) {
      Pageable page = Pagification.createPageTemplate(from, size);
      List<Movie> movie = movieRepository.findAll(page).getContent();
      return movie
            .stream()
            .map(this::toMovieDTO)
            .sorted(new Comparator<MovieDTO>() {
               @Override
               public int compare(MovieDTO o1, MovieDTO o2) {
                  return o1.getId().compareTo(o2.getId());
               }
            })
            .toList();
   }

   public List<MovieDTO> getMovie() {
      List<Movie> movie = movieRepository.findAll();
      return movie
            .stream()
            .map(this::toMovieDTO)
            .sorted(new Comparator<MovieDTO>() {
               @Override
               public int compare(MovieDTO o1, MovieDTO o2) {
                  return o1.getId().compareTo(o2.getId());
               }
            })
            .toList();
   }

   public MovieDTO createMovie(CreateMovieDTO createMovieDTO, HttpServletRequest request) {
      Coordinates coordinate = coordinatesRepository.findById(createMovieDTO.getCoordinatesId())
            .orElseThrow(() -> new CoordinatesNotFoundException(
                  String.format("Coordinates with id %s not found", createMovieDTO.getCoordinatesId())));

      Person director = personRepository.findById(createMovieDTO.getDirectorId())
            .orElseThrow(() -> new PersonNotFoundException(
                  String.format("Person with id %s not found", createMovieDTO.getDirectorId())));

      Person screenwriter = null;
      if (createMovieDTO.getScreenwriterId() != null) {
         screenwriter = personRepository.findById(createMovieDTO.getScreenwriterId())
               .orElseThrow(() -> new PersonNotFoundException(
                     String.format("Person with id %s not found", createMovieDTO.getScreenwriterId())));
      }

      Person operator = null;
      if (createMovieDTO.getOperatorId() != null) {
         operator = personRepository.findById(createMovieDTO.getOperatorId())
               .orElseThrow(() -> new PersonNotFoundException(
                     String.format("Person with id %s not found", createMovieDTO.getOperatorId())));
      }

      User user = findUserByRequest(request);

      Movie movie = Movie
            .builder()
            .name(createMovieDTO.getName())
            .coordinates(coordinate)
            .creationDate(LocalDateTime.now())
            .oscarsCount(createMovieDTO.getOscarsCount())
            .budget(createMovieDTO.getBudget())
            .totalBoxOffice(createMovieDTO.getTotalBoxOffice())
            .mpaaRating(createMovieDTO.getMpaaRating())
            .director(director)
            .screenwriter(screenwriter)
            .operator(operator)
            .length(createMovieDTO.getLength())
            .goldenPalmCount(createMovieDTO.getGoldenPalmCount())
            .usaBoxOffice(createMovieDTO.getUsaBoxOffice())
            .tagline(createMovieDTO.getTagline())
            .genre(createMovieDTO.getGenre())
            .adminCanModify(createMovieDTO.getAdminCanModify())
            .user(user)
            .build();

      movie = movieRepository.save(movie);
      simpMessagingTemplate.convertAndSend("/topic", "New Movie created");

      return toMovieDTO(movie);
   }

   public MovieDTO alterMovie(Long movieId, AlterMovieDTO alterMovieDTO, HttpServletRequest request) {
      Movie movie = movieRepository.findById(movieId)
            .orElseThrow(() -> new CoordinatesNotFoundException(
                  String.format("Movie with id %s not found", movieId)));

      if (!checkPermission(movie, request))
         throw new ForbiddenException(String.format("No access to movie with id %s", movieId));

      if (alterMovieDTO.getName() != null)
         movie.setName(alterMovieDTO.getName());

      if (alterMovieDTO.getCoordinatesId() != null) {
         Coordinates coordinates = coordinatesRepository.findById(alterMovieDTO.getCoordinatesId())
               .orElseThrow(() -> new CoordinatesNotFoundException(
                     String.format("Coordinates with id %s not found", alterMovieDTO.getCoordinatesId())));
         movie.setCoordinates(coordinates);
      }

      movie.setOscarsCount(alterMovieDTO.getOscarsCount());

      if (alterMovieDTO.getBudget() != null)
         movie.setBudget(alterMovieDTO.getBudget());

      movie.setUsaBoxOffice(alterMovieDTO.getUsaBoxOffice());
      movie.setTotalBoxOffice(alterMovieDTO.getTotalBoxOffice());

      if (alterMovieDTO.getMpaaRating() != null)
         movie.setMpaaRating(alterMovieDTO.getMpaaRating());

      if (alterMovieDTO.getDirectorId() != null) {
         Person director = personRepository.findById(alterMovieDTO.getDirectorId())
               .orElseThrow(() -> new PersonNotFoundException(
                     String.format("Person with id %s not found", alterMovieDTO.getDirectorId())));
         movie.setDirector(director);
      }
      if (alterMovieDTO.getScreenwriterId() != null) {
         Person screenwriter = personRepository.findById(alterMovieDTO.getScreenwriterId())
               .orElseThrow(() -> new PersonNotFoundException(
                     String.format("Person with id %s not found", alterMovieDTO.getScreenwriterId())));
         movie.setScreenwriter(screenwriter);
      }
      else{
         movie.setScreenwriter(null);
      }
      if (alterMovieDTO.getOperatorId() != null) {
         Person operator = personRepository.findById(alterMovieDTO.getOperatorId())
               .orElseThrow(() -> new PersonNotFoundException(
                     String.format("Person with id %s not found", alterMovieDTO.getOperatorId())));
         movie.setOperator(operator);
      }
      else{
         movie.setOperator(null);
      }
      if (alterMovieDTO.getLength() != null)
         movie.setLength(alterMovieDTO.getLength());

      movie.setGoldenPalmCount(alterMovieDTO.getGoldenPalmCount());

      movie.setTagline(alterMovieDTO.getTagline());

      movie.setGenre(alterMovieDTO.getGenre());

      if (alterMovieDTO.getAdminCanModify() != null)
         movie.setAdminCanModify(alterMovieDTO.getAdminCanModify());

      movie = movieRepository.save(movie);
      simpMessagingTemplate.convertAndSend("/topic", "Movie updated");
      return toMovieDTO(movie);
   }

   public void deleteMovie(Long movieId, HttpServletRequest request) {
      Movie movie = movieRepository.findById(movieId)
            .orElseThrow(() -> new CoordinatesNotFoundException(
                  String.format("Movie with id %s not found", movieId)));
      if (!checkPermission(movie, request))
         throw new ForbiddenException(String.format("No access to movie with id %s", movieId));
      movieRepository.delete(movie);
      simpMessagingTemplate.convertAndSend("/topic", "Movie deleted");
   }

   public List<Object[]> countMoviesByDirector() {
      return movieRepository.countMoviesByDirector();
   }

   public List<MovieDTO> getMoviesTaglineContaining(String substring) {
      List<Movie> movies = movieRepository.findAllByTaglineContaining(substring);

      return movies
            .stream()
            .map(this::toMovieDTO)
            .sorted(new Comparator<MovieDTO>() {
               @Override
               public int compare(MovieDTO o1, MovieDTO o2) {
                  return o1.getId().compareTo(o2.getId());
               }
            })
            .toList();
   }

   public List<MovieDTO> findMoviesUsaBoxOfficeLess(long usaBoxOffice) {
      List<Movie> movies = movieRepository.findAllByUsaBoxOfficeLessThan(usaBoxOffice);

      return movies
            .stream()
            .map(this::toMovieDTO)
            .sorted(new Comparator<MovieDTO>() {
               @Override
               public int compare(MovieDTO o1, MovieDTO o2) {
                  return o1.getId().compareTo(o2.getId());
               }
            })
            .toList();
   }

   public List<MovieDTO> findMoviesWithNoOscars() {
      List<Movie> movies = movieRepository.findMoviesWithNoOscars();

      return movies
            .stream()
            .map(this::toMovieDTO)
            .sorted(new Comparator<MovieDTO>() {
               @Override
               public int compare(MovieDTO o1, MovieDTO o2) {
                  return o1.getId().compareTo(o2.getId());
               }
            })
            .toList();
   }

   @Transactional
   public void removeOscarsFromDirectorsWithMoviesInGenre(MovieGenre genre, HttpServletRequest request) {
      List<Movie> movies = movieRepository.findMoviesByDirectorsWithMoviesInGenre(genre);
      if (jwtUtils.parseJwt(request) == null || jwtUtils.getUserNameFromJwtToken(jwtUtils.parseJwt(request)) == null)
         throw new ForbiddenException("You have no rights to remove oscars");

      for (Movie movie : movies) {
         if (!checkPermission(movie, request))
            throw new ForbiddenException(String.format("No access to movie with id %s", movie.getId()));
         movie.setOscarsCount(0);
         movieRepository.save(movie);
      }
      simpMessagingTemplate.convertAndSend("/topic", "Successfully removed oscars from directors with movies in genre");
   }

   private MovieDTO toMovieDTO(Movie movie) {
      return MovieDTO
            .builder()
            .id(movie.getId())
            .name(movie.getName())
            .coordinates(new CoordinatesDTO(
                  movie.getCoordinates().getId(),
                  movie.getCoordinates().getX(),
                  movie.getCoordinates().getY(),
                  movie.getCoordinates().getAdminCanModify(),
                  movie.getCoordinates().getUser().getId()))
            .creationDate(movie.getCreationDate())
            .oscarsCount(movie.getOscarsCount())
            .budget(movie.getBudget())
            .totalBoxOffice(movie.getTotalBoxOffice())
            .mpaaRating(movie.getMpaaRating())
            .director(PersonDTO
                  .builder()
                  .id(movie.getDirector().getId())
                  .name(movie.getDirector().getName())
                  .eyeColor(movie.getDirector().getEyeColor())
                  .hairColor(movie.getDirector().getHairColor())
                  .location(new LocationDTO(
                        movie.getDirector().getLocation().getId(),
                        movie.getDirector().getLocation().getX(),
                        movie.getDirector().getLocation().getY(),
                        movie.getDirector().getLocation().getZ(),
                        movie.getDirector().getLocation().getName(),
                        movie.getDirector().getLocation().getAdminCanModify(),
                        movie.getDirector().getLocation().getUser().getId()))
                  .weight(movie.getDirector().getWeight())
                  .nationality(movie.getDirector().getNationality())
                  .userId(movie.getDirector().getUser().getId())
                  .build())
            .screenwriter(movie.getScreenwriter() != null ? PersonDTO
                  .builder()
                  .id(movie.getScreenwriter().getId())
                  .name(movie.getScreenwriter().getName())
                  .eyeColor(movie.getScreenwriter().getEyeColor())
                  .hairColor(movie.getScreenwriter().getHairColor())
                  .location(new LocationDTO(
                        movie.getScreenwriter().getLocation().getId(),
                        movie.getScreenwriter().getLocation().getX(),
                        movie.getScreenwriter().getLocation().getY(),
                        movie.getScreenwriter().getLocation().getZ(),
                        movie.getScreenwriter().getLocation().getName(),
                        movie.getScreenwriter().getLocation().getAdminCanModify(),
                        movie.getScreenwriter().getLocation().getUser().getId()))
                  .weight(movie.getScreenwriter().getWeight())
                  .nationality(movie.getScreenwriter().getNationality())
                  .adminCanModify(movie.getScreenwriter().getAdminCanModify())
                  .userId(movie.getScreenwriter().getUser().getId())
                  .build() : null)
            .operator(movie.getOperator() != null ? PersonDTO
                  .builder()
                  .id(movie.getOperator().getId())
                  .name(movie.getOperator().getName())
                  .eyeColor(movie.getOperator().getEyeColor())
                  .hairColor(movie.getOperator().getHairColor())
                  .location(new LocationDTO(
                        movie.getOperator().getLocation().getId(),
                        movie.getOperator().getLocation().getX(),
                        movie.getOperator().getLocation().getY(),
                        movie.getOperator().getLocation().getZ(),
                        movie.getOperator().getLocation().getName(),
                        movie.getOperator().getLocation().getAdminCanModify(),
                        movie.getOperator().getLocation().getUser().getId()))
                  .weight(movie.getOperator().getWeight())
                  .nationality(movie.getOperator().getNationality())
                  .adminCanModify(movie.getOperator().getAdminCanModify())
                  .userId(movie.getOperator().getUser().getId())
                  .build() : null)
            .length(movie.getLength())
            .goldenPalmCount(movie.getGoldenPalmCount())
            .usaBoxOffice(movie.getUsaBoxOffice())
            .tagline(movie.getTagline())
            .genre(movie.getGenre())
            .adminCanModify(movie.getAdminCanModify())
            .userId(movie.getUser().getId())
            .build();
   }

   private User findUserByRequest(HttpServletRequest request) {
      String username = jwtUtils.getUserNameFromJwtToken(jwtUtils.parseJwt(request));
      return userRepository.findByUsername(username).get();
   }

   private boolean checkPermission(Movie movie, HttpServletRequest request) {
      String username = jwtUtils.getUserNameFromJwtToken(jwtUtils.parseJwt(request));
      User fromUser = userRepository.findByUsername(username).get();
      return movie.getUser().getUsername().equals(username) || fromUser.getRole() == Role.ADMIN &&
            movie.getAdminCanModify();
   }
}
