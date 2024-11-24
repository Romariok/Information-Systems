package itmo.is.lab1.utils.exceptions;

public class UserNotFoundException extends RuntimeException {
   public UserNotFoundException(String message) {
       super(message);
   }
}