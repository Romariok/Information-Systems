package itmo.is.lab1.user.model;

import lombok.*;

import java.util.Collection;
import java.util.List;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import jakarta.persistence.*;

@Entity
@Table(name = "app_users")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder(toBuilder = true)
public class User implements UserDetails {
   @Id
   @GeneratedValue(strategy = GenerationType.IDENTITY)
   private Long id;

   @Column(name = "username", unique = true, nullable = false)
   private String username;

   @Column(name = "password", unique = true, nullable = false)
   private String password;

   @Column(name = "role", nullable = false)
   @Enumerated(EnumType.STRING)
   private Role role;

   @Override
   public boolean isAccountNonExpired() {
      return true;
   }

   @Override
   public boolean isAccountNonLocked() {
      return true;
   }

   @Override
   public boolean isCredentialsNonExpired() {
      return true;
   }

   @Override
   public boolean isEnabled() {
      return true;
   }

   @Override
   public Collection<? extends GrantedAuthority> getAuthorities() {
      return List.of(role);
   }
}
