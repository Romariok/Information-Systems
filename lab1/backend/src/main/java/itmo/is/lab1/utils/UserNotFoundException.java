package itmo.is.lab1.utils;

public class UserNotFoundException extends RuntimeException {
   public UserNotFoundException(String message) {
       super(message);
   }
}