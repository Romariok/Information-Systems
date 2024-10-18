package itmo.is.lab1.utils.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalControllerExceptionHandler {

   @ExceptionHandler
   @ResponseStatus(HttpStatus.BAD_REQUEST)
   public ErrorResponse handleAdminRequestAlreadyExistException(AdminRequestAlreadyExistException e) {
      return new ErrorResponse(e.getClass().getCanonicalName(),
            e.getMessage());
   }

   @ExceptionHandler
   @ResponseStatus(HttpStatus.BAD_REQUEST)
   public ErrorResponse handleCoordinatesAlreadyExistException(CoordinatesAlreadyExistException e) {
      return new ErrorResponse(e.getClass().getCanonicalName(),
            e.getMessage());
   }

   @ExceptionHandler
   @ResponseStatus(HttpStatus.BAD_REQUEST)
   public ErrorResponse handleLocationAlreadyExistException(LocationAlreadyExistException e) {
      return new ErrorResponse(e.getClass().getCanonicalName(),
            e.getMessage());
   }

   @ExceptionHandler
   @ResponseStatus(HttpStatus.BAD_REQUEST)
   public ErrorResponse handleMovieAlreadyExistException(MovieAlreadyExistException e) {
      return new ErrorResponse(e.getClass().getCanonicalName(),
            e.getMessage());
   }

   @ExceptionHandler
   @ResponseStatus(HttpStatus.BAD_REQUEST)
   public ErrorResponse handlePersonAlreadyExistException(PersonAlreadyExistException e) {
      return new ErrorResponse(e.getClass().getCanonicalName(),
            e.getMessage());
   }

   @ExceptionHandler
   @ResponseStatus(HttpStatus.BAD_REQUEST)
   public ErrorResponse handleUserAlreadyExistException(UserAlreadyExistException e) {
      return new ErrorResponse(e.getClass().getCanonicalName(),
            e.getMessage());
   }

   @ExceptionHandler
   @ResponseStatus(HttpStatus.BAD_REQUEST)
   public ErrorResponse handleAdminRequestNotFoundException(AdminRequestNotFoundException e) {
      return new ErrorResponse(e.getClass().getCanonicalName(),
            e.getMessage());
   }

   @ExceptionHandler
   @ResponseStatus(HttpStatus.BAD_REQUEST)
   public ErrorResponse handleCoordinatesNotFoundException(CoordinatesNotFoundException e) {
      return new ErrorResponse(e.getClass().getCanonicalName(),
            e.getMessage());
   }

   @ExceptionHandler
   @ResponseStatus(HttpStatus.BAD_REQUEST)
   public ErrorResponse handleLocationNotFoundException(LocationNotFoundException e) {
      return new ErrorResponse(e.getClass().getCanonicalName(),
            e.getMessage());
   }

   @ExceptionHandler
   @ResponseStatus(HttpStatus.BAD_REQUEST)
   public ErrorResponse handleMovieNotFoundException(MovieNotFoundException e) {
      return new ErrorResponse(e.getClass().getCanonicalName(),
            e.getMessage());
   }

   @ExceptionHandler
   @ResponseStatus(HttpStatus.BAD_REQUEST)
   public ErrorResponse handlePersonNotFoundException(PersonNotFoundException e) {
      return new ErrorResponse(e.getClass().getCanonicalName(),
            e.getMessage());
   }

   @ExceptionHandler
   @ResponseStatus(HttpStatus.BAD_REQUEST)
   public ErrorResponse handleUserNotFoundException(UserNotFoundException e) {
      return new ErrorResponse(e.getClass().getCanonicalName(),
            e.getMessage());
   }

   @ExceptionHandler
   @ResponseStatus(HttpStatus.BAD_REQUEST)
   public ErrorResponse handleMForbiddenException(ForbiddenException e) {
      return new ErrorResponse(e.getClass().getCanonicalName(),
            e.getMessage());
   }

   @ExceptionHandler
   @ResponseStatus(HttpStatus.BAD_REQUEST)
   public ErrorResponse handleUserAlreadyAdminException(UserAlreadyAdminException e) {
      return new ErrorResponse(e.getClass().getCanonicalName(),
            e.getMessage());
   }

}
