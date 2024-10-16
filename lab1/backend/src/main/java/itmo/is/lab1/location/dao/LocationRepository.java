package itmo.is.lab1.location.dao;

import itmo.is.lab1.location.model.Location;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LocationRepository extends JpaRepository<Location, Long> {
   boolean existsByXAndYAndZAndName(Double x, long y, Integer z, String name);

   Location findByName(String name);
}
