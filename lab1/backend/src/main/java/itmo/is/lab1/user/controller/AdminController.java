package itmo.is.lab1.user.controller;

import org.springframework.web.bind.annotation.*;

import itmo.is.lab1.user.dto.AdminRequestDTO;
import itmo.is.lab1.user.service.AdminService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

import java.util.List;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
public class AdminController {
   private final AdminService adminService;

   @GetMapping
   public List<AdminRequestDTO> getAdminRequests() {
      return adminService.getAdminRequests();
   }

   @PostMapping
   public void createAdminRequest(HttpServletRequest request) {
      adminService.createAdminRequest(request);
   }

   @PutMapping("/{adminRequestId}")
   public void approveOnAdminRequest(@PathVariable Long adminRequestId, HttpServletRequest request) {
      adminService.approveOnAdminRequest(adminRequestId, request);
   }

}
