package itmo.is.lab1.location.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.NotBlank;

import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class AlterLocationDTO {
   @Max(100)
   private Double x;

   @Max(100)
   private long y;

   @Max(100)
   private Integer z;

   @NotBlank
   private String name;
}
