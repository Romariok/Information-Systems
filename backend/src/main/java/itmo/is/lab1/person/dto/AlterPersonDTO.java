package itmo.is.lab1.person.dto;

import itmo.is.lab1.person.model.Color;
import itmo.is.lab1.person.model.Country;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class AlterPersonDTO {
   @Size(min = 1)
   private String name;

   @NotNull
   private Color eyeColor;

   private Color hairColor;

   @NotNull
   @Positive   
   private Long locationId;

   @Positive 
   @NotNull 
   private Long weight;

   @NotNull
   private Boolean adminCanModify;

   @NotNull
   private Country nationality;
}
