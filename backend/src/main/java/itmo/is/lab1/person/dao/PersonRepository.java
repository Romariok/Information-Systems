package itmo.is.lab1.person.dao;

import itmo.is.lab1.location.model.Location;
import itmo.is.lab1.person.model.*;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PersonRepository extends JpaRepository<Person, Long> {
   boolean existsByName(String name);

   Person findByNameAndEyeColorAndNationality(String name, Color eyeColor, Country nationality);

   List<Person> findAllByLocation(Location location);

   boolean existsByNameAndEyeColorAndNationality(String name, Color eyeColor, Country nationality);
}
