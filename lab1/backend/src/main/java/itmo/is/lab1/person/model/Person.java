package itmo.is.lab1.person.model;

import java.io.Serializable;

import itmo.is.lab1.location.model.Location;
import itmo.is.lab1.user.model.User;
import jakarta.persistence.*;
import lombok.*;

/**
 * @author Romariok on 30.09.2024
 */
@Entity
@Table(name = "person")
@Builder(toBuilder = true)
@NoArgsConstructor
@AllArgsConstructor
@Data
public class Person implements Serializable{
   @Id
   @GeneratedValue(strategy = GenerationType.IDENTITY)
   private Long id;

   @Column(name = "name", nullable = false)
   private String name;

   @Column(name = "eye_color", nullable = false)
   @Enumerated(EnumType.STRING)
   private Color eyeColor;

   @Column(name = "hair_color")
   @Enumerated(EnumType.STRING)
   private Color hairColor;

   @ManyToOne(fetch = FetchType.EAGER)
   @JoinColumn(name = "location_id")
   private Location location;

   @Column(name = "weight", nullable = false)
   private Long weight;

   @Column(name = "nationality", nullable = false)
   @Enumerated(EnumType.STRING)
   private Country nationality;

   @Column(name = "admin_can_modify", nullable = false)
   private Boolean adminCanModify;
   
   @ManyToOne(fetch = FetchType.EAGER)
   @JoinColumn(name = "user_id")
   private User user;
}
