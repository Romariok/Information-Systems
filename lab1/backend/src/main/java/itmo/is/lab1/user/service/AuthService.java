package itmo.is.lab1.user.service;

import org.springframework.stereotype.Service;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;

import itmo.is.lab1.security.jwt.JwtUtils;
import itmo.is.lab1.user.dao.UserRepository;
import itmo.is.lab1.user.dto.AuthResponseDTO;
import itmo.is.lab1.user.dto.LoginUserDTO;
import itmo.is.lab1.user.dto.RegisterUserDTO;
import itmo.is.lab1.user.model.Role;
import itmo.is.lab1.user.model.User;
import itmo.is.lab1.utils.exceptions.UserAlreadyExistException;
import itmo.is.lab1.utils.exceptions.UserNotFoundException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {
   
   private final JwtUtils jwtUtils;
   private final UserRepository userRepository;
   private final PasswordEncoder passwordEncoder;
   private final AuthenticationManager authenticationManager;

   public AuthResponseDTO register(RegisterUserDTO registerUserDto) {
      if (userRepository.existsByUsername(registerUserDto.getUsername()))
          throw new UserAlreadyExistException(
                  String.format("Username %s already exists", registerUserDto.getUsername())
          );

      User user = User
              .builder()
              .username(registerUserDto.getUsername())
              .password(passwordEncoder.encode(registerUserDto.getPassword()))
              .role(Role.USER)
              .build();

      user = userRepository.save(user);

      String token = jwtUtils.generateJwtToken(user.getUsername());
      return new AuthResponseDTO(
              user.getUsername(),
              user.getRole(),
              token
      );
  }

  public AuthResponseDTO login(LoginUserDTO loginUserDto) {
   User user = userRepository.findByUsername(loginUserDto.getUsername())
           .orElseThrow(() -> new UserNotFoundException(
                   String.format("Username %s not found", loginUserDto.getUsername())
           ));

   authenticationManager.authenticate(
           new UsernamePasswordAuthenticationToken(loginUserDto.getUsername(), loginUserDto.getPassword())
   );

   String token = jwtUtils.generateJwtToken(user.getUsername());
   return new AuthResponseDTO(
           user.getUsername(),
           user.getRole(),
           token
   );
}

}
