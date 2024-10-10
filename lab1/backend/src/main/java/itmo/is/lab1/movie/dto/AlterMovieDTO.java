package itmo.is.lab1.movie.dto;

import itmo.is.lab1.movie.model.MovieGenre;
import itmo.is.lab1.movie.model.MpaaRating;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class AlterMovieDTO {
   @Size(min = 1)
   private String name;

   @Positive  
   private Long coordinatesId;

   private java.time.LocalDate creationDate;

   @Positive
   private int oscarsCount;

   @Positive
   private Double budget;

   @Positive 
   private long totalBoxOffice;

   private MpaaRating mpaaRating;

   @Positive  
   private Long directorId;

   @Positive 
   private Long screenwriterId;

   @Positive  
   private Long operatorId;

   @Positive
   private Long length;

   @Positive
   private Long goldenPalmCount;

   @Positive
   private long usaBoxOffice;

   private String tagline;
   private MovieGenre genre;
}
