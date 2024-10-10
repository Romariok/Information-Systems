package itmo.is.lab1.utils;

public class PersonNotFoundException extends RuntimeException {
   public PersonNotFoundException(String message) {
       super(message);
   }
}