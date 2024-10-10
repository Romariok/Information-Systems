package itmo.is.lab1.person.dto;

import itmo.is.lab1.person.model.Color;
import itmo.is.lab1.person.model.Country;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class CreatePersonDTO {
   @NotBlank
   private String name;

   @NotNull
   private Color eyeColor;

   private Color hairColor;

   @NotNull
   @Positive   
   private Long locationId;

   @NotNull
   @Positive  
   private Long weight;

   @NotNull
   private Country nationality;
}
