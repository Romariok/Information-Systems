package itmo.is.lab1.security.service;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import itmo.is.lab1.user.dao.UserRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthUserDetailsService implements UserDetailsService {
   private final UserRepository userRepository;

   @Override
   public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
      return  userRepository.findByUsername(username)
                  .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));
   }
}
