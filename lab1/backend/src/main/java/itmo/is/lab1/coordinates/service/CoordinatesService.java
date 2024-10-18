package itmo.is.lab1.coordinates.service;

import java.util.Comparator;
import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import itmo.is.lab1.Pagification;
import itmo.is.lab1.coordinates.dao.CoordinatesRepository;
import itmo.is.lab1.coordinates.dto.*;
import itmo.is.lab1.coordinates.model.Coordinates;
import itmo.is.lab1.movie.dao.MovieRepository;
import itmo.is.lab1.movie.model.Movie;
import itmo.is.lab1.security.jwt.JwtUtils;
import itmo.is.lab1.user.dao.UserRepository;
import itmo.is.lab1.user.model.User;
import itmo.is.lab1.user.model.Role;
import itmo.is.lab1.utils.exceptions.*;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CoordinatesService {
   private final CoordinatesRepository coordinatesRepository;
   private final MovieRepository movieRepository;
   private final UserRepository userRepository;
   private final JwtUtils jwtUtils;
   private final SimpMessagingTemplate simpMessagingTemplate;

   public List<CoordinatesDTO> getCoordinates(int from, int size) {
      Pageable page = Pagification.createPageTemplate(from, size);
      List<Coordinates> coordinates = coordinatesRepository.findAll(page).getContent();
      return coordinates
            .stream()
            .map(coordinates1 -> new CoordinatesDTO(
                  coordinates1.getId(),
                  coordinates1.getX(),
                  coordinates1.getY(),
                  coordinates1.getUser().getId()))
            .sorted(new Comparator<CoordinatesDTO>() {
               @Override
               public int compare(CoordinatesDTO o1, CoordinatesDTO o2) {
                  return o1.getId().compareTo(o2.getId());
               }
            })
            .toList();
   }

   public CoordinatesDTO createCoordinate(CreateCoordinatesDTO createCoordinatesDTO, HttpServletRequest request) {
      if (coordinatesRepository.existsByXAndY(
            createCoordinatesDTO.getX(),
            createCoordinatesDTO.getY()))
         throw new CoordinatesAlreadyExistException(String.format("Coordinates %f %d already exist",
               createCoordinatesDTO.getX(), createCoordinatesDTO.getY()));

      User user = findUserByRequest(request);

      Coordinates coordinates = Coordinates
            .builder()
            .x(createCoordinatesDTO.getX())
            .y(createCoordinatesDTO.getY())
            .user(user)
            .build();

      coordinates = coordinatesRepository.save(coordinates);
      simpMessagingTemplate.convertAndSend("/topic", "New coordinates added");
      return new CoordinatesDTO(
            coordinates.getId(),
            coordinates.getX(),
            coordinates.getY(),
            coordinates.getUser().getId());
   }

   public CoordinatesDTO alterCoordinate(Long coordinatesId, AlterCoordinatesDTO alterCoordinatesDTO,
         HttpServletRequest request) {
      Coordinates coordinates = coordinatesRepository.findById(coordinatesId)
            .orElseThrow(() -> new CoordinatesNotFoundException(
                  String.format("Coordinates with id %d not found", coordinatesId)));
      if (!checkPermission(coordinates, request))
         throw new ForbiddenException(String.format("No access to coordinates with id %d", coordinatesId));

      if (alterCoordinatesDTO.getX() != null)
         coordinates.setX(alterCoordinatesDTO.getX());

      coordinates = coordinatesRepository.save(coordinates);
      simpMessagingTemplate.convertAndSend("/topic", "Coordinates updated");

      return new CoordinatesDTO(
            coordinates.getId(),
            coordinates.getX(),
            coordinates.getY(),
            coordinates.getUser().getId());
   }

   public void deleteCoordinates(Long coordinatesId, HttpServletRequest request) {
      Coordinates coordinates = coordinatesRepository.findById(coordinatesId)
            .orElseThrow(() -> new CoordinatesNotFoundException(
                  String.format("Coordinates with id %d not found", coordinatesId)));
      if (!checkPermission(coordinates, request))
         throw new ForbiddenException(String.format("No access to coordinates with id %d", coordinatesId));

      List<Movie> moviesWithThisCoordinates = movieRepository.findAllByCoordinates(coordinates);

      movieRepository.deleteAll(moviesWithThisCoordinates);
      coordinatesRepository.deleteById(coordinatesId);
      simpMessagingTemplate.convertAndSend("/topic", "Coordinates deleted");
   }

   private User findUserByRequest(HttpServletRequest request) {
      String username = jwtUtils.getUserNameFromJwtToken(jwtUtils.parseJwt(request));
      System.out.println(username);
      return userRepository.findByUsername(username).get();
   }

   private boolean checkPermission(Coordinates coordinates, HttpServletRequest request) {
      String username = jwtUtils.getUserNameFromJwtToken(jwtUtils.parseJwt(request));
      User fromUser = userRepository.findByUsername(username).get();
      return coordinates.getUser().getUsername().equals(username) || fromUser.getRole() == Role.ADMIN;
   }
}
