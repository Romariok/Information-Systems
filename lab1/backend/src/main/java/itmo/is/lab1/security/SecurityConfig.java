package itmo.is.lab1.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;

import itmo.is.lab1.security.jwt.JwtAuthEntryPoint;
import itmo.is.lab1.security.jwt.JwtAuthTokenFilter;
import itmo.is.lab1.security.service.AuthUserDetailsService;
import lombok.*;

import java.util.List;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

   private final JwtAuthEntryPoint unauthorizedHandler;

   private final AuthUserDetailsService userDetailsService;


   @Bean
   public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
      http.csrf(csrf -> csrf.disable())
            .cors(cors -> cors.configurationSource(request -> {
               CorsConfiguration corsConfiguration = new CorsConfiguration();
               corsConfiguration.setAllowedOrigins(List.of("http://localhost:3000"));
               corsConfiguration.setAllowedMethods(List.of("POST", "GET", "PUT", "PATCH", "DELETE", "OPTIONS"));
               corsConfiguration
                     .setAllowedHeaders(List.of("Content-Type", "Authorization", "X-Requested-With", "from", "size"));
               corsConfiguration.setAllowCredentials(true);
               return corsConfiguration;
            }))
            .exceptionHandling(exception -> exception.authenticationEntryPoint(unauthorizedHandler))
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(request -> request
                  .requestMatchers("/auth/**", "/user/role/**", "/ws/**").permitAll()
                  .requestMatchers(HttpMethod.GET, "/admin/**").hasRole("ADMIN")
                  .requestMatchers(HttpMethod.PUT, "/admin/**").hasRole("ADMIN")
                  .anyRequest().authenticated());

      http.authenticationProvider(authenticationProvider())
            .addFilterBefore(authenticationJwtTokenFilter(), UsernamePasswordAuthenticationFilter.class);

      return http.build();
   }
   @Bean
   public JwtAuthTokenFilter authenticationJwtTokenFilter() {
      return new JwtAuthTokenFilter();
   }

   @Bean
   public DaoAuthenticationProvider authenticationProvider() {
      DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();

      authProvider.setUserDetailsService(userDetailsService);
      authProvider.setPasswordEncoder(passwordEncoder());

      return authProvider;
   }

   @Bean
   public PasswordEncoder passwordEncoder() {
      return new BCryptPasswordEncoder();
   }

   @Bean
   public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
      return authConfig.getAuthenticationManager();
   }

}
