package itmo.is.lab1.utils.exceptions;

public class CoordinatesAlreadyExistException extends RuntimeException {
   public CoordinatesAlreadyExistException(String message) {
       super(message);
   }
}