package itmo.is.lab1.movie.model;

import itmo.is.lab1.coordinates.model.Coordinates;
import itmo.is.lab1.person.model.Person;
import itmo.is.lab1.user.model.User;
import jakarta.persistence.*;
import java.io.Serializable;
import java.time.LocalDateTime;

import lombok.*;

/**
 * @author Romariok on 30.09.2024
 */

@Entity
@Table(name = "movie")
@Builder(toBuilder = true)
@NoArgsConstructor
@AllArgsConstructor
@Data
public class Movie implements Serializable{

   @Id
   @GeneratedValue(strategy = GenerationType.IDENTITY)
   private Long id;

   @Column(name = "name", nullable = false)
   private String name;

   @ManyToOne(fetch = FetchType.EAGER)
   @JoinColumn(name = "coordinates_id", nullable = false)
   private Coordinates coordinates;

   @Column(name = "creation_date", nullable = false)
   private LocalDateTime creationDate;

   @Column(name = "oscars_count", nullable = false)
   private int oscarsCount;

   @Column(name = "budget")
   private Double budget;

   @Column(name = "total_box_office", nullable = false)
   private long totalBoxOffice;

   @Column(name = "mpaa_rating", nullable = false)
   @Enumerated(EnumType.STRING)
   private MpaaRating mpaaRating;

   @ManyToOne(fetch = FetchType.EAGER)
   @JoinColumn(name = "director_id", nullable = false)
   private Person director;

   @ManyToOne(fetch = FetchType.EAGER)
   @JoinColumn(name = "screenwriter_id")
   private Person screenwriter;

   @ManyToOne(fetch = FetchType.EAGER)
   @JoinColumn(name = "operator_id")
   private Person operator;

   @Column(name = "length", nullable = false)
   private Long length;

   @Column(name = "golden_palm_count")
   private Long goldenPalmCount;

   @Column(name = "usa_box_office", nullable = false)
   private long usaBoxOffice;

   @Column(name = "tagline")
   private String tagline;

   @Column(name = "genre")
   @Enumerated(EnumType.STRING)
   private MovieGenre genre;

   @Column(name = "admin_can_modify", nullable = false)
   private Boolean adminCanModify;

   @ManyToOne(fetch = FetchType.EAGER)
   @JoinColumn(name = "user_id")
   private User user;
}