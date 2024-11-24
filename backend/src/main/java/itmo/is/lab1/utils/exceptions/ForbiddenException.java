package itmo.is.lab1.utils.exceptions;

public class ForbiddenException extends RuntimeException {
   public ForbiddenException(String message) {
       super(message);
   }
}