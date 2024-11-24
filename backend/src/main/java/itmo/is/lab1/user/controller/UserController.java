package itmo.is.lab1.user.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import itmo.is.lab1.user.model.Role;
import itmo.is.lab1.user.service.UserService;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/user")
public class UserController {
   private final UserService userService;

   @GetMapping("/role/{username}")
   public Role getRoleByUsername(@PathVariable String username) {
      return userService.getRoleByUsername(username);
   }
}
