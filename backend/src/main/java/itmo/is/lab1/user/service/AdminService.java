package itmo.is.lab1.user.service;

import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.data.domain.Pageable;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import itmo.is.lab1.user.model.AdminRequest;
import itmo.is.lab1.user.model.Role;
import itmo.is.lab1.Pagification;
import itmo.is.lab1.movie.model.Movie;
import itmo.is.lab1.person.model.Person;
import itmo.is.lab1.security.jwt.JwtUtils;
import itmo.is.lab1.user.dao.AdminRequestRepository;
import itmo.is.lab1.user.dao.UserRepository;
import itmo.is.lab1.user.dto.AdminRequestDTO;
import itmo.is.lab1.user.model.User;
import itmo.is.lab1.utils.exceptions.*;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AdminService {
   private final UserRepository userRepository;
   private final JwtUtils jwtUtils;
   private final AdminRequestRepository adminRequestRepository;
   private final SimpMessagingTemplate simpMessagingTemplate;

   public List<AdminRequestDTO> getAdminRequests(int from, int size) {
      Pageable page = Pagification.createPageTemplate(from, size);
      List<AdminRequest> adminRequests = adminRequestRepository.findAll(page).getContent();

      return adminRequests
            .stream()
            .map(adminRequest -> new AdminRequestDTO(adminRequest.getId(), adminRequest.getUser().getUsername()))
            .sorted(new Comparator<AdminRequestDTO>() {
               @Override
               public int compare(AdminRequestDTO o1, AdminRequestDTO o2) {
                  return o1.getId().compareTo(o2.getId());
               }
            })
            .toList();
   }

   public void approveOnAdminRequest(Long adminRequestId, HttpServletRequest request) {
      AdminRequest adminJoinRequest = adminRequestRepository.findById(adminRequestId)
            .orElseThrow(() -> new AdminRequestNotFoundException(
                  String.format("Admin join request not found %d", adminRequestId)));

      User fromUser = adminJoinRequest.getUser();
      fromUser.setRole(Role.ADMIN);
      userRepository.save(fromUser);

      adminRequestRepository.delete(adminJoinRequest);
      simpMessagingTemplate.convertAndSend("/topic", "Admin Request approved");
   }

   public void createAdminRequest(HttpServletRequest request) {
      User fromUser = findUserByRequest(request);

      if (userRepository.findAllByRole(Role.ADMIN).isEmpty()) {
         fromUser.setRole(Role.ADMIN);
         userRepository.save(fromUser);
         simpMessagingTemplate.convertAndSend("/topic", "New Admin Created");
         return;
      }

      if (fromUser.getRole() == Role.ADMIN)
         throw new UserAlreadyAdminException(
               String.format("User %s is already an admin", fromUser.getUsername()));
      if (adminRequestRepository.existsByUser(fromUser))
         throw new AdminRequestAlreadyExistException(
               String.format("Admin request already exists from user %s", fromUser.getUsername()));
      AdminRequest adminRequest = new AdminRequest(null, fromUser);

      adminRequestRepository.save(adminRequest);
      simpMessagingTemplate.convertAndSend("/topic", "Admin Request created");
   }


   private User findUserByRequest(HttpServletRequest request) {
      String username = jwtUtils.getUserNameFromJwtToken(jwtUtils.parseJwt(request));
      return userRepository.findByUsername(username).get();
   }


}
