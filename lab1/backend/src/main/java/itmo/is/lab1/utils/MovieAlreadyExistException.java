package itmo.is.lab1.utils;

public class MovieAlreadyExistException extends RuntimeException {
   public MovieAlreadyExistException(String message) {
       super(message);
   }
}