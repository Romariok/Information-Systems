package itmo.is.lab1.movie.dto;

import itmo.is.lab1.movie.model.MovieGenre;
import itmo.is.lab1.movie.model.MpaaRating;
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

   @NotNull
   private java.time.LocalDate creationDate;

   @Positive
   private int oscarsCount;

   @Positive
   private Double budget;

   @Positive 
   private long totalBoxOffice;

   @NotNull
   private MpaaRating mpaaRating;

   @NotNull
   @Positive  
   private Long directorId;

   @Positive 
   private Long screenwriterId;

   @Positive  
   private Long operatorId;

   @NotNull
   @Positive
   private Long length;

   @Positive
   private Long goldenPalmCount;

   @Positive
   private long usaBoxOffice;

   private String tagline;
   private MovieGenre genre;
}
