package itmo.is.lab1.utils.exceptions;

public class UserAlreadyExistException extends RuntimeException {
   public UserAlreadyExistException(String message) {
       super(message);
   }
}
