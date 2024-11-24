package itmo.is.lab1.utils.exceptions;

public class PersonNotFoundException extends RuntimeException {
   public PersonNotFoundException(String message) {
       super(message);
   }
}