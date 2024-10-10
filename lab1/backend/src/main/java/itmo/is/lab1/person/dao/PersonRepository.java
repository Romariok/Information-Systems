package itmo.is.lab1.person.dao;

import itmo.is.lab1.person.model.Person;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PersonRepository extends JpaRepository<Person, Long> {
   boolean existsByName(String name);

   Person findByName(String name);
}
