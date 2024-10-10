package itmo.is.lab1.security.jwt;

import itmo.is.lab1.security.service.AuthUserDetailsService;

import org.slf4j.LoggerFactory;
import org.slf4j.Logger;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;

public class JwtAuthTokenFilter extends OncePerRequestFilter {
   private JwtUtils jwtUtils;

   private AuthUserDetailsService userDetailsService;

   private static final Logger logger = LoggerFactory.getLogger(JwtAuthTokenFilter.class);

   @Override
   protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
         throws ServletException, IOException {
      try {
         UserDetails userDetails = getUserDetails(request);

         if (userDetails != null) {
            UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                  userDetails, null, userDetails.getAuthorities());

            authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

            SecurityContextHolder.getContext().setAuthentication(authentication);
         }
      } catch (Exception e) {
         logger.error("Cannot set user authentication: { }", e);
      }

      filterChain.doFilter(request, response);
   }

   public UserDetails getUserDetails(HttpServletRequest request) {
      String jwt = jwtUtils.parseJwt(request);

      if (jwt == null || !jwtUtils.validateJwtToken(jwt))
          return null;

      String username = jwtUtils.getUserNameFromJwtToken(jwt);

      return userDetailsService.loadUserByUsername(username);
  }

}
