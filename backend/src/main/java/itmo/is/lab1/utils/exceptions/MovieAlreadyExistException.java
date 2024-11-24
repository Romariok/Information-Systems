package itmo.is.lab1.utils.exceptions;

public class MovieAlreadyExistException extends RuntimeException {
   public MovieAlreadyExistException(String message) {
       super(message);
   }
}