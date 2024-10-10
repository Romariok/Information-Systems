package itmo.is.lab1.utils;

public class AdminRequestAlreadyExistException extends RuntimeException {
   public AdminRequestAlreadyExistException(String message) {
       super(message);
   }
}