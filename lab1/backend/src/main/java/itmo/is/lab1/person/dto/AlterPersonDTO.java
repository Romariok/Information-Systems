package itmo.is.lab1.person.dto;

import itmo.is.lab1.person.model.Color;
import itmo.is.lab1.person.model.Country;
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

   private Color eyeColor;

   private Color hairColor;

   @Positive   
   private Long locationId;

   @Positive  
   private Long weight;

   private Country nationality;
}
