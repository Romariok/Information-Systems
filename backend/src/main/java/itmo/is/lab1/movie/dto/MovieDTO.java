package itmo.is.lab1.movie.dto;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonFormat;

import itmo.is.lab1.coordinates.dto.CoordinatesDTO;
import itmo.is.lab1.movie.model.MovieGenre;
import itmo.is.lab1.movie.model.MpaaRating;
import itmo.is.lab1.person.dto.PersonDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@AllArgsConstructor
@Getter
@Builder(toBuilder = true)
public class MovieDTO {
   private Long id;
   private String name;
   private CoordinatesDTO coordinates;
   @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
   private LocalDateTime creationDate;
   private int oscarsCount;
   private Double budget;
   private long totalBoxOffice;
   private MpaaRating mpaaRating;
   private PersonDTO director;
   private PersonDTO screenwriter;
   private PersonDTO operator;
   private Long length;
   private Long goldenPalmCount;
   private long usaBoxOffice;
   private String tagline;
   private MovieGenre genre;
   private Boolean adminCanModify;
   private Long userId;
}
