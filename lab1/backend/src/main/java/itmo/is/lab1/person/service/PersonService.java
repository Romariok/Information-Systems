package itmo.is.lab1.person.service;

import org.springframework.stereotype.Service;

import itmo.is.lab1.location.dto.LocationDTO;
import itmo.is.lab1.location.model.Location;
import itmo.is.lab1.location.dao.LocationRepository;
import itmo.is.lab1.movie.dao.MovieRepository;
import itmo.is.lab1.movie.model.Movie;
import itmo.is.lab1.person.dao.PersonRepository;
import itmo.is.lab1.person.dto.*;
import itmo.is.lab1.person.model.Person;
import itmo.is.lab1.security.jwt.JwtUtils;
import itmo.is.lab1.user.dao.UserRepository;
import itmo.is.lab1.user.model.Role;
import itmo.is.lab1.user.model.User;
import itmo.is.lab1.utils.LocationNotFoundException;
import itmo.is.lab1.utils.PersonNotFoundException;
import itmo.is.lab1.utils.ForbiddenException;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

import java.util.List;
import java.util.Comparator;

@Service
@RequiredArgsConstructor
public class PersonService {
   private final PersonRepository personRepository;
   private final LocationRepository locationRepository;
   private final MovieRepository movieRepository;
   private final UserRepository userRepository;
   private final JwtUtils jwtUtils;

   public List<PersonDTO> getPerson() {
      List<Person> person = personRepository.findAll();
      return person
            .stream()
            .map(this::toPersonDTO)
            .sorted(new Comparator<PersonDTO>() {
               @Override
               public int compare(PersonDTO o1, PersonDTO o2) {
                  return o1.getId().compareTo(o2.getId());
               }
            })
            .toList();
   }

   public PersonDTO createPerson(CreatePersonDTO createPersonDTO, HttpServletRequest request) {

      Location location = locationRepository.findById(createPersonDTO.getLocationId())
            .orElseThrow(() -> new PersonNotFoundException(
                  String.format("Location with id %s not found", createPersonDTO.getLocationId())));

      User user = findUserByRequest(request);

      Person person = Person
            .builder()
            .name(createPersonDTO.getName())
            .eyeColor(createPersonDTO.getEyeColor())
            .hairColor(createPersonDTO.getHairColor())
            .location(location)
            .weight(createPersonDTO.getWeight())
            .nationality(createPersonDTO.getNationality())
            .user(user)
            .build();

      person = personRepository.save(person);
      return toPersonDTO(person);
   }

   public PersonDTO alterPerson(Long personId, AlterPersonDTO alterPersonDTO, HttpServletRequest request) {
      Person person = personRepository.findById(personId)
            .orElseThrow(() -> new PersonNotFoundException(
                  String.format("Person with id %s not found", personId)));

      if (!checkPermission(person, request))
         throw new ForbiddenException(String.format("No access to person with id %s", personId));

      if (alterPersonDTO.getName() != null) {
         person.setName(alterPersonDTO.getName());
      }
      if (alterPersonDTO.getEyeColor() != null) {
         person.setEyeColor(alterPersonDTO.getEyeColor());
      }
      if (alterPersonDTO.getLocationId() != null) {
         Location location = locationRepository.findById(alterPersonDTO.getLocationId())
               .orElseThrow(() -> new LocationNotFoundException(
                     String.format("Location with id %s not found", alterPersonDTO.getLocationId())));
         person.setLocation(location);
      }
      if (alterPersonDTO.getWeight() != null) {
         person.setWeight(alterPersonDTO.getWeight());
      }
      if (alterPersonDTO.getNationality() != null) {
         person.setNationality(alterPersonDTO.getNationality());
      }

      person = personRepository.save(person);
      return toPersonDTO(person);
   }

   public void deletePerson(Long personId, HttpServletRequest request) {
      Person person = personRepository.findById(personId)
            .orElseThrow(() -> new PersonNotFoundException(
                  String.format("Person with id %s not found", personId)));

      if (!checkPermission(person, request))
         throw new ForbiddenException(String.format("No access to person with id %s", personId));

      List<Movie> moviesWithThisPerson = movieRepository.findAllByPerson(person);

      movieRepository.deleteAll(moviesWithThisPerson);
      personRepository.deleteById(personId);
   }

   private PersonDTO toPersonDTO(Person person) {
      return PersonDTO
            .builder()
            .id(person.getId())
            .name(person.getName())
            .eyeColor(person.getEyeColor())
            .hairColor(person.getHairColor())
            .location(new LocationDTO(
                  person.getLocation().getId(),
                  person.getLocation().getX(),
                  person.getLocation().getY(),
                  person.getLocation().getZ(),
                  person.getLocation().getName(),
                  person.getLocation().getUser().getId()))
            .weight(person.getWeight())
            .nationality(person.getNationality())
            .userId(person.getUser().getId())
            .build();
   }

   private User findUserByRequest(HttpServletRequest request) {
      String username = jwtUtils.parseJwt(request);
      return userRepository.findByUsername(username).get();
   }

   private boolean checkPermission(Person person, HttpServletRequest request) {
      String username = jwtUtils.parseJwt(request);
      User fromUser = userRepository.findByUsername(username).get();
      return person.getUser().getUsername().equals(username) || fromUser.getRole() == Role.ADMIN;
   }
}
