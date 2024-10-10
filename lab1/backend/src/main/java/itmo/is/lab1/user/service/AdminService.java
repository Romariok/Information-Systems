package itmo.is.lab1.user.service;

import java.util.Comparator;
import java.util.List;

import org.springframework.stereotype.Service;

import itmo.is.lab1.user.model.AdminRequest;
import itmo.is.lab1.user.model.Role;
import itmo.is.lab1.security.jwt.JwtUtils;
import itmo.is.lab1.user.dao.AdminRequestRepository;
import itmo.is.lab1.user.dao.UserRepository;
import itmo.is.lab1.user.dto.AdminRequestDTO;
import itmo.is.lab1.user.model.User;
import itmo.is.lab1.utils.AdminRequestAlreadyExistException;
import itmo.is.lab1.utils.AdminRequestNotFoundException;
import itmo.is.lab1.utils.UserAlreadyAdminException;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AdminService {
   private final UserRepository userRepository;
   private final JwtUtils jwtUtils;
   private final AdminRequestRepository adminRequestRepository;

   public List<AdminRequestDTO> getAdminRequests() {
      List<AdminRequest> adminRequests = adminRequestRepository.findAll();

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
   }

   public void createAdminRequest(HttpServletRequest request) {
      User fromUser = findUserByRequest(request);

      if (userRepository.findAllByRole(Role.ADMIN).isEmpty()) {
         fromUser.setRole(Role.ADMIN);
         userRepository.save(fromUser);
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

   }

   private User findUserByRequest(HttpServletRequest request) {
      String username = jwtUtils.parseJwt(request);
      return userRepository.findByUsername(username).get();
   }
}
