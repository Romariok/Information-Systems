package itmo.is.lab1.utils.exceptions;

import java.util.List;
import java.util.stream.Collectors;

import org.postgresql.util.PSQLException;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import io.minio.errors.MinioException;

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
   public ErrorResponse handleNullPointerException(NullPointerException e) {
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
   public ErrorResponse handleMinioException(MinioException e) {
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
   public ErrorResponse handlePSQLException(PSQLException e) {
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

   @ExceptionHandler
   @ResponseStatus(HttpStatus.BAD_REQUEST)
   public ErrorResponse handleIllegalArgumentException(IllegalArgumentException e) {
      return new ErrorResponse(
            e.getClass().getCanonicalName(),
            e.getMessage());
   }

   @ExceptionHandler
   @ResponseStatus(HttpStatus.BAD_REQUEST)
   public ErrorResponse handleMethodArgumentNotValidException(MethodArgumentNotValidException e) {
      List<String> errors = e.getBindingResult()
            .getFieldErrors()
            .stream()
            .map(error -> String.format(
                  "Ошибка валидации поля '%s': %s (текущее значение: '%s')",
                  error.getField(),
                  error.getDefaultMessage(),
                  error.getRejectedValue() == null ? "пусто" : error.getRejectedValue()))
            .collect(Collectors.toList());

      return new ErrorResponse(
            "Ошибка валидации",
            String.join("\n", errors));
   }
}
