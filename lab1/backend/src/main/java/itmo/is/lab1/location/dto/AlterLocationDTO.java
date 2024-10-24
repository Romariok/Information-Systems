package itmo.is.lab1.location.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class AlterLocationDTO {
   @Max(100)
   @Min(-100)
   @NotNull
   private Double x;

   @Max(100)
   @Min(-100)
   private long y;

   @Max(100)
   @Min(-100)
   @NotNull
   private Integer z;

   @NotBlank
   private String name;
   @NotNull
   private Boolean adminCanModify;
}
