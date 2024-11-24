package itmo.is.lab1.movie.dto;

import itmo.is.lab1.movie.model.MovieGenre;
import itmo.is.lab1.movie.model.MpaaRating;
import itmo.is.lab1.utils.NullOrPositive;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class CreateMovieDTO {
   @NotBlank
   private String name;

   @NotNull
   @Positive  
   private Long coordinatesId;

   @Min(value=0)
   private int oscarsCount;

   @NullOrPositive
   private Double budget;

   @Positive
   private long totalBoxOffice;

   @NotNull
   private MpaaRating mpaaRating;

   @NotNull
   @Positive  
   private Long directorId;

   @NullOrPositive
   private Long screenwriterId;

   @NullOrPositive
   private Long operatorId;

   @NotNull
   @Positive
   private Long length;

   @NullOrPositive
   private Long goldenPalmCount;

   @Positive
   private long usaBoxOffice;

   private String tagline;
   private MovieGenre genre;

   @NotNull
   private Boolean adminCanModify;
}
