package itmo.is.lab1.utils.exceptions;

public class UserAlreadyAdminException extends RuntimeException {
   public UserAlreadyAdminException(String message) {
       super(message);
   }
}