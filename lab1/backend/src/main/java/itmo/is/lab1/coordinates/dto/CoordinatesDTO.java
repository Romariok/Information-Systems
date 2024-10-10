package itmo.is.lab1.coordinates.dto;

import lombok.*;

@AllArgsConstructor
@Getter
public class CoordinatesDTO {
   private Long id;
   private Double x;
   private long y;
   private Long userId;
}
