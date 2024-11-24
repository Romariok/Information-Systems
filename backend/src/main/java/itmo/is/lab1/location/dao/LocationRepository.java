package itmo.is.lab1.location.dao;

import itmo.is.lab1.location.model.Location;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LocationRepository extends JpaRepository<Location, Long> {
   boolean existsByXAndYAndZ(Double x, long y, Integer z);
   boolean existsByName(String name);
   Location findByName(String name);
}
