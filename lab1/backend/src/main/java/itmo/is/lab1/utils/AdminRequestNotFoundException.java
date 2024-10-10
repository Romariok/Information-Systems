package itmo.is.lab1.utils;

public class AdminRequestNotFoundException extends RuntimeException {
   public AdminRequestNotFoundException(String message) {
       super(message);
   }
}