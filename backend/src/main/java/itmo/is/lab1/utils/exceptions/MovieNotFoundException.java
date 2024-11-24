package itmo.is.lab1.utils.exceptions;

public class MovieNotFoundException extends RuntimeException {
   public MovieNotFoundException(String message) {
       super(message);
   }
}