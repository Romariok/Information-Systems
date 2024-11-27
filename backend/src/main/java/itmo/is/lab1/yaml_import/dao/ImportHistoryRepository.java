package itmo.is.lab1.yaml_import.dao;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import itmo.is.lab1.user.model.User;
import itmo.is.lab1.yaml_import.model.ImportHistory;

@Repository
public interface ImportHistoryRepository extends JpaRepository<ImportHistory, Long> {
   Page<ImportHistory> findAllByUser(User user, Pageable pageable);

   Page<ImportHistory> findAll(Pageable pageable);

   Optional<ImportHistory> findById(Long id);
}
