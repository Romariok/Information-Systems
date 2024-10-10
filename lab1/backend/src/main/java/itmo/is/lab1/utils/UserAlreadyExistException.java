package itmo.is.lab1.utils;

public class UserAlreadyExistException extends RuntimeException {
   public UserAlreadyExistException(String message) {
       super(message);
   }
}
