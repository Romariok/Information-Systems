package itmo.is.lab1.location.model;

import java.io.Serializable;

import itmo.is.lab1.user.model.User;
import jakarta.persistence.*;
import lombok.*;

/**
 * @author Romariok on 30.09.2024
 */ 
@Entity
@Table(name = "location")
@Builder(toBuilder = true)
@NoArgsConstructor
@AllArgsConstructor
@Data
public class Location implements Serializable{
   @Id
   @GeneratedValue(strategy = GenerationType.IDENTITY)
   private Long id;

   @Column(name = "x", nullable = false)
   private Double x;

   @Column(name = "y")
   private long y;

   @Column(name = "z", nullable = false)
   private Integer z;

   @Column(name = "name", nullable = false)
   private String name;

   @Column(name = "admin_can_modify", nullable = false)
   private Boolean adminCanModify;

   @ManyToOne(fetch = FetchType.EAGER)
   @JoinColumn(name = "user_id")
   private User user;
}