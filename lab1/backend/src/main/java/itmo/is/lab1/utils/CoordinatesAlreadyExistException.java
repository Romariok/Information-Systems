package itmo.is.lab1.utils;

public class CoordinatesAlreadyExistException extends RuntimeException {
   public CoordinatesAlreadyExistException(String message) {
       super(message);
   }
}