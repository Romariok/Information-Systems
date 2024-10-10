package itmo.is.lab1.coordinates.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import itmo.is.lab1.coordinates.dto.*;
import itmo.is.lab1.coordinates.service.CoordinatesService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/coordinates")
@RequiredArgsConstructor
public class CoordinatesController {
   private final CoordinatesService coordinatesService;

   @GetMapping
   public List<CoordinatesDTO> getCoordinates() {
      return coordinatesService.getCoordinates();
   }

   @PostMapping
   public CoordinatesDTO createCoordinate(@RequestBody @Valid CreateCoordinatesDTO createCoordinatesDTO,
         HttpServletRequest request) {
      return coordinatesService.createCoordinate(createCoordinatesDTO, request);
   }

   @PatchMapping("/{coordinatesId}")
   public CoordinatesDTO alterCoordinate(@PathVariable Long coordinatesId,
         @RequestBody @Valid AlterCoordinatesDTO alterCoordinatesDTO, HttpServletRequest request) {
      return coordinatesService.alterCoordinate(coordinatesId, alterCoordinatesDTO, request);
   }

   @DeleteMapping("/{coordinatesId}")
   public void deleteCoordinates(@PathVariable Long coordinatesId, HttpServletRequest request) {
      coordinatesService.deleteCoordinates(coordinatesId, request);
   }

}
