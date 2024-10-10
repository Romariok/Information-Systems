package itmo.is.lab1.coordinates.dto;

import jakarta.validation.constraints.Max;

import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class AlterCoordinatesDTO {

   @Max(500)
   private Double x;

   @Max(500)
   private long y;
}