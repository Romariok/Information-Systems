package itmo.is.lab1.coordinates.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class AlterCoordinatesDTO {

   @NotNull
   @Max(500)
   @Min(-500)
   private Double x;

   @Max(500)
   @Min(-500)
   private long y;

   @NotNull
   private Boolean adminCanModify;
}