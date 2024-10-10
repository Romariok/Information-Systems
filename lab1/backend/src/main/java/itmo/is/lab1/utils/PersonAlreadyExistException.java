package itmo.is.lab1.utils;

public class PersonAlreadyExistException extends RuntimeException {
   public PersonAlreadyExistException(String message) {
       super(message);
   }
}
