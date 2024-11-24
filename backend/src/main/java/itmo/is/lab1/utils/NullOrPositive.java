package itmo.is.lab1.utils;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.Documented;
import java.lang.annotation.Retention;
import java.lang.annotation.Target;

import static java.lang.annotation.ElementType.FIELD;
import static java.lang.annotation.ElementType.METHOD;
import static java.lang.annotation.ElementType.PARAMETER;
import static java.lang.annotation.ElementType.TYPE_USE;
import static java.lang.annotation.RetentionPolicy.RUNTIME;

@Documented
@Constraint(validatedBy = NullOrPositiveValidator.class)
@Target({METHOD, FIELD, PARAMETER, TYPE_USE})
@Retention(RUNTIME)
public @interface NullOrPositive {
    String message() default "Value must be null or positive";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}