package itmo.is.lab1.yaml_import.controller;

import java.io.IOException;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import itmo.is.lab1.yaml_import.service.ImportService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/import")
@RequiredArgsConstructor
public class ImportController {
   private final ImportService importService;

   @PostMapping
   public void importCoordinates(@RequestParam MultipartFile file, HttpServletRequest request) throws IOException {
      importService.importFile(file, request);
   }
}
