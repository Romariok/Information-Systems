package itmo.is.lab1.location.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class CreateLocationDTO {
   @NotNull
   @Max(100)
   private Double x;

   @Max(100)
   private long y;

   @NotNull
   @Max(100)
   private Integer z;

   @NotBlank
   private String name;
}
