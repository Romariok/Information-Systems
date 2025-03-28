package itmo.is.lab1.location.controller;

import org.springframework.web.bind.annotation.*;

import itmo.is.lab1.location.dto.*;
import itmo.is.lab1.location.service.LocationService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import java.util.List;

@RestController
@RequestMapping("/location")
@RequiredArgsConstructor
public class LocationController {
   private final LocationService locationService;

   @GetMapping
   public List<LocationDTO> getLocations(@RequestParam int from, @RequestParam int size) {
      return locationService.getLocations(from, size);
   }

   @PostMapping
   public LocationDTO createLocation(@RequestBody @Valid CreateLocationDTO createLocationDTO, HttpServletRequest request) {
      return locationService.createLocation(createLocationDTO, request);
   }

   @PatchMapping("/{locationId}")
   public LocationDTO alterLocation(@PathVariable Long locationId, @RequestBody @Valid AlterLocationDTO alterLocationDTO,
         HttpServletRequest request) {
      return locationService.alterLocation(locationId, alterLocationDTO, request);
   }

   @DeleteMapping("/{locationId}")
   public void deleteLocation(@PathVariable Long locationId, HttpServletRequest request) {
      locationService.deleteLocation(locationId, request);
   }
}
