package itmo.is.lab1.user.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import itmo.is.lab1.user.model.AdminRequest;
import itmo.is.lab1.user.model.User;

@Repository
public interface AdminRequestRepository extends JpaRepository<AdminRequest, Long> {
   boolean existsByUser(User user);
}
