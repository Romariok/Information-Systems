package itmo.is.lab1.person.dto;

import itmo.is.lab1.location.dto.LocationDTO;
import itmo.is.lab1.person.model.Color;
import itmo.is.lab1.person.model.Country;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@AllArgsConstructor
@Getter
@Builder(toBuilder = true)
public class PersonDTO {
   private Long id;
   private String name;
   private Color eyeColor;
   private Color hairColor;
   private LocationDTO location;
   private Long weight;
   private Country nationality;
   private Long userId;
}
