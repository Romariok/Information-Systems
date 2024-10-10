package itmo.is.lab1.utils;

public class MovieNotFoundException extends RuntimeException {
   public MovieNotFoundException(String message) {
       super(message);
   }
}