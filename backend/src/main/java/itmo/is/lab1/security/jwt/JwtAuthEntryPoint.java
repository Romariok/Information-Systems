package itmo.is.lab1.security.jwt;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;


import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import java.io.IOException;
@Component
public class JwtAuthEntryPoint implements AuthenticationEntryPoint {
   // private static final Logger logger = LoggerFactory.getLogger(JwtAuthEntryPoint.class);

   @Override
   public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException authException)
         throws IOException, ServletException {
      // logger.error("Unauthorized error: {}", authException.getMessage());

      // response.setContentType(MediaType.APPLICATION_JSON_VALUE);
      // response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);

      // final Map<String, Object> body = new HashMap<>();
      // body.put("status", HttpServletResponse.SC_UNAUTHORIZED);
      // body.put("error", "Unauthorized");
      // body.put("message", authException.getMessage());
      // body.put("path", request.getServletPath());

      // final ObjectMapper mapper = new ObjectMapper();
      // mapper.writeValue(response.getOutputStream(), body);
      response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
   }
}
