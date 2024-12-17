package itmo.is.lab1.yaml_import.controller;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import itmo.is.lab1.security.jwt.JwtUtils;
import itmo.is.lab1.user.dao.UserRepository;
import itmo.is.lab1.user.model.User;
import itmo.is.lab1.yaml_import.dao.ImportHistoryRepository;
import itmo.is.lab1.yaml_import.dto.ImportHistoryDTO;
import itmo.is.lab1.yaml_import.model.ImportHistory;
import itmo.is.lab1.yaml_import.model.OperationStatus;
import itmo.is.lab1.yaml_import.service.ImportService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/import")
@RequiredArgsConstructor
public class ImportController {

   private final ImportService importService;
   private final ImportHistoryRepository importHistoryRepository;
   private final SimpMessagingTemplate simpMessagingTemplate;
   private final JwtUtils jwtUtils;
   private final UserRepository userRepository;

   @PostMapping
   public ResponseEntity<String> importCoordinates(@RequestParam MultipartFile file,
         HttpServletRequest request) throws IOException {
      ImportHistory importHistory = new ImportHistory();
      User user = findUserByRequest(request);
      if (file.isEmpty()) {
         importHistory.setStatus(OperationStatus.FAILURE);
         importHistory.setUser(user);
         importHistory.setImportTime(LocalDateTime.now());
         importHistory.setImportedCount(0);
         importHistory.setFileUrl(null);
         importHistoryRepository.save(importHistory);
         simpMessagingTemplate.convertAndSend("/topic", "Import failed");
         return ResponseEntity.badRequest().body("File is empty");
      }
      try {
         importService.importFile(file, request);
         simpMessagingTemplate.convertAndSend("/topic", "Import successful");
         return ResponseEntity.ok("Import successful");
      } catch (Exception e) {
         importHistory.setStatus(OperationStatus.FAILURE);
         importHistory.setUser(user);
         importHistory.setFileUrl(null);
         importHistory.setImportTime(LocalDateTime.now());
         importHistory.setImportedCount(0);
         importHistoryRepository.save(importHistory);
         simpMessagingTemplate.convertAndSend("/topic", "Import failed");
         return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
      }

   }

   @GetMapping
   public List<ImportHistoryDTO> getImportHistory(@RequestParam int from, @RequestParam int size,
         HttpServletRequest request) {
      return importService.getImportHistory(from, size, request);
   }

   @DeleteMapping("/{id}")
   public ResponseEntity<String> deleteImportHistory(@PathVariable Long id, HttpServletRequest request) {
      importService.deleteImportHistory(id, request);
      return ResponseEntity.ok("Import history deleted");
   }

   private User findUserByRequest(HttpServletRequest request) {
      String username = jwtUtils.getUserNameFromJwtToken(jwtUtils.parseJwt(request));
      return userRepository.findByUsername(username)
            .orElseThrow(() -> new UsernameNotFoundException(
                  String.format("Username %s not found", username)));
   }
}
