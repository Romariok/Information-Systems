package itmo.is.lab1.coordinates.dao;

import itmo.is.lab1.coordinates.model.Coordinates;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CoordinatesRepository extends JpaRepository<Coordinates, Long> {
   boolean existsByXAndY(Double x, long y);
   Coordinates findByXAndY(Double x, long y);
}
