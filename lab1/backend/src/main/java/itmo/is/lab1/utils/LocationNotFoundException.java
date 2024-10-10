package itmo.is.lab1.utils;

public class LocationNotFoundException extends RuntimeException {
   public LocationNotFoundException(String message) {
       super(message);
   }
}