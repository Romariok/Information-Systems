package itmo.is.lab1.location.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class LocationDTO {
   private Long id;
   private Double x;
   private long y;
   private Integer z;
   private String name;
   private Long userId;
}
