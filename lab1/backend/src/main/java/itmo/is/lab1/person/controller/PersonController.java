package itmo.is.lab1.person.controller;

import org.springframework.web.bind.annotation.*;

import itmo.is.lab1.person.dto.*;
import itmo.is.lab1.person.service.PersonService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import java.util.List;

@RestController
@RequestMapping("/person")
@RequiredArgsConstructor
public class PersonController {

   private final PersonService personService;

   @GetMapping
   public List<PersonDTO> getPerson() {
      return personService.getPerson();
   }

   @PostMapping
   public PersonDTO createPerson(@RequestBody @Valid CreatePersonDTO createPersonDTO, HttpServletRequest request) {
      return personService.createPerson(createPersonDTO, request);
   }

   @PatchMapping("/{personId}")
   public PersonDTO alterPerson(@PathVariable Long personId, @RequestBody AlterPersonDTO alterPersonDTO,
         HttpServletRequest request) {
      return personService.alterPerson(personId, alterPersonDTO, request);
   }

   @DeleteMapping("/{personId}")
   public void deletePerson(@PathVariable Long personId, HttpServletRequest request) {
      personService.deletePerson(personId, request);
   }
}
