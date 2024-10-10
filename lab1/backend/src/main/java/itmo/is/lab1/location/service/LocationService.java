package itmo.is.lab1.location.service;

import org.springframework.stereotype.Service;

import itmo.is.lab1.location.model.Location;
import itmo.is.lab1.location.dao.LocationRepository;
import itmo.is.lab1.location.dto.*;
import itmo.is.lab1.movie.dao.MovieRepository;
import itmo.is.lab1.movie.model.Movie;
import itmo.is.lab1.person.dao.PersonRepository;
import itmo.is.lab1.person.model.Person;
import itmo.is.lab1.security.jwt.JwtUtils;
import itmo.is.lab1.user.dao.UserRepository;
import itmo.is.lab1.user.model.Role;
import itmo.is.lab1.user.model.User;
import itmo.is.lab1.utils.LocationNotFoundException;
import itmo.is.lab1.utils.ForbiddenException;
import itmo.is.lab1.utils.LocationAlreadyExistException;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

import java.util.List;
import java.util.Comparator;

@Service
@RequiredArgsConstructor
public class LocationService {
   private final LocationRepository locationRepository;
   private final MovieRepository movieRepository;
   private final UserRepository userRepository;
   private final PersonRepository personRepository;
   private final JwtUtils jwtUtils;

   public List<LocationDTO> getLocations() {
      List<Location> location = locationRepository.findAll();
      return location
            .stream()
            .map(location1 -> new LocationDTO(
               location1.getId(),
                  location1.getX(),
                  location1.getY(),
                  location1.getZ(),
                  location1.getName(),
                  location1.getUser().getId()))
            .sorted(new Comparator<LocationDTO>() {
               @Override
               public int compare(LocationDTO o1, LocationDTO o2) {
                  return o1.getId().compareTo(o2.getId());
               }
            })
            .toList();
   }

   public LocationDTO createLocation(CreateLocationDTO createLocationDTO, HttpServletRequest request) {
      if (locationRepository.existsByXAndYAndZAndName(
            createLocationDTO.getX(),
            createLocationDTO.getY(),
            createLocationDTO.getZ(),
            createLocationDTO.getName()))
         throw new LocationAlreadyExistException(String.format("Location %f %d already exist",
               createLocationDTO.getX(), createLocationDTO.getY()));

      User user = findUserByRequest(request);

      Location location = Location
            .builder()
            .x(createLocationDTO.getX())
            .y(createLocationDTO.getY())
            .z(createLocationDTO.getZ())
            .name(createLocationDTO.getName())
            .user(user)
            .build();

      location = locationRepository.save(location);
      return new LocationDTO(
            location.getId(),
            location.getX(),
            location.getY(),
            location.getZ(),
            location.getName(),
            location.getUser().getId());
   }

   public LocationDTO alterLocation(Long locationId, AlterLocationDTO alterLocationDTO,
         HttpServletRequest request) {
      Location location = locationRepository.findById(locationId)
            .orElseThrow(() -> new LocationNotFoundException(
                  String.format("Location with id %d not found", locationId)));
      if (!checkPermission(location, request))
         throw new ForbiddenException(String.format("No access to location with id %d", locationId));

      if (alterLocationDTO.getX() != null)
         location.setX(alterLocationDTO.getX());
      if (alterLocationDTO.getZ() != null)
         location.setZ(alterLocationDTO.getZ());
      if (alterLocationDTO.getName() != null)
         location.setName(alterLocationDTO.getName());

      location = locationRepository.save(location);

      return new LocationDTO(
            location.getId(),
            location.getX(),
            location.getY(),
            location.getZ(),
            location.getName(),
            location.getUser().getId());
   }

   public void deleteLocation(Long locationId, HttpServletRequest request) {
      Location location = locationRepository.findById(locationId)
            .orElseThrow(() -> new LocationNotFoundException(
                  String.format("Location with id %d not found", locationId)));
      if (!checkPermission(location, request))
         throw new ForbiddenException(String.format("No access to location with id %d", locationId));

      List<Person> personsWithThisLocation = personRepository.findAllByLocation(location);

      for (Person person : personsWithThisLocation) {
         List<Movie> moviesWithThisPerson = movieRepository.findAllByPerson(person);
         movieRepository.deleteAll(moviesWithThisPerson);
      }
      
      personRepository.deleteAll(personsWithThisLocation);
      locationRepository.deleteById(locationId);
   }

   private User findUserByRequest(HttpServletRequest request) {
      String username = jwtUtils.parseJwt(request);
      return userRepository.findByUsername(username).get();
   }

   private boolean checkPermission(Location location, HttpServletRequest request) {
      String username = jwtUtils.parseJwt(request);
      User fromUser = userRepository.findByUsername(username).get();
      return location.getUser().getUsername().equals(username) || fromUser.getRole() == Role.ADMIN;
   }
}
