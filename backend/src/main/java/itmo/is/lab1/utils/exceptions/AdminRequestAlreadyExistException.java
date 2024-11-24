package itmo.is.lab1.utils.exceptions;

public class AdminRequestAlreadyExistException extends RuntimeException {
   public AdminRequestAlreadyExistException(String message) {
       super(message);
   }
}