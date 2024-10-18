package itmo.is.lab1.utils.exceptions;

public class AdminRequestNotFoundException extends RuntimeException {
   public AdminRequestNotFoundException(String message) {
       super(message);
   }
}