package itmo.is.lab1.person.service;

import org.springframework.data.domain.Pageable;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import itmo.is.lab1.location.dto.LocationDTO;
import itmo.is.lab1.location.model.Location;
import itmo.is.lab1.Pagification;
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
import itmo.is.lab1.utils.exceptions.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

import java.util.List;
import java.util.Comparator;

@Service
@RequiredArgsConstructor
@Transactional
public class PersonService {
   private final PersonRepository personRepository;
   private final LocationRepository locationRepository;
   private final MovieRepository movieRepository;
   private final UserRepository userRepository;
   private final JwtUtils jwtUtils;
   private final SimpMessagingTemplate simpMessagingTemplate;

   public List<PersonDTO> getPerson(int from, int size) {
      Pageable page = Pagification.createPageTemplate(from, size);
      List<Person> person = personRepository.findAll(page).getContent();
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
   
   @Transactional
   public PersonDTO createPerson(CreatePersonDTO createPersonDTO, HttpServletRequest request) {

      Location location = locationRepository.findById(createPersonDTO.getLocationId())
            .orElseThrow(() -> new PersonNotFoundException(
                  String.format("Location with id %s not found", createPersonDTO.getLocationId())));

      if (personRepository.existsByNameAndEyeColorAndNationality(createPersonDTO.getName(),
            createPersonDTO.getEyeColor(), createPersonDTO.getNationality()))
         throw new PersonAlreadyExistException(
               String.format("Person with name %s, eye color %s, nationality %s already exists",
                     createPersonDTO.getName(), createPersonDTO.getEyeColor(), createPersonDTO.getNationality()));

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
            .adminCanModify(createPersonDTO.getAdminCanModify())
            .build();

      person = personRepository.save(person);
      simpMessagingTemplate.convertAndSend("/topic", "New Person added");
      return toPersonDTO(person);
   }

   @Transactional
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
      person.setHairColor(alterPersonDTO.getHairColor());
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

      if (alterPersonDTO.getAdminCanModify() != null) {
         person.setAdminCanModify(alterPersonDTO.getAdminCanModify());
      }

      person = personRepository.save(person);
      simpMessagingTemplate.convertAndSend("/topic", "Person updated");
      return toPersonDTO(person);
   }

   @Transactional
   public void deletePerson(Long personId, HttpServletRequest request) {
      Person person = personRepository.findById(personId)
            .orElseThrow(() -> new PersonNotFoundException(
                  String.format("Person with id %s not found", personId)));

      if (!checkPermission(person, request))
         throw new ForbiddenException(String.format("No access to person with id %s", personId));

      List<Movie> moviesWithThisPerson = movieRepository.findAllByPerson(person);

      movieRepository.deleteAll(moviesWithThisPerson);
      personRepository.deleteById(personId);
      simpMessagingTemplate.convertAndSend("/topic", "Person deleted");
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
                  person.getLocation().getAdminCanModify(),
                  person.getLocation().getUser().getId()))
            .weight(person.getWeight())
            .nationality(person.getNationality())
            .adminCanModify(person.getAdminCanModify())
            .userId(person.getUser().getId())
            .build();
   }

   private User findUserByRequest(HttpServletRequest request) {
      String username = jwtUtils.getUserNameFromJwtToken(jwtUtils.parseJwt(request));
      return userRepository.findByUsername(username)
            .orElseThrow(() -> new UsernameNotFoundException(
                  String.format("Username %s not found", username)));
   }

   private boolean checkPermission(Person person, HttpServletRequest request) {
      String username = jwtUtils.getUserNameFromJwtToken(jwtUtils.parseJwt(request));
      User fromUser = userRepository.findByUsername(username).get();
      return person.getUser().getUsername().equals(username) || fromUser.getRole() == Role.ADMIN &&
            person.getAdminCanModify();
   }
}
