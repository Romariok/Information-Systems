package itmo.is.lab1.utils;

public class LocationAlreadyExistException extends RuntimeException {
   public LocationAlreadyExistException(String message) {
       super(message);
   }
}
