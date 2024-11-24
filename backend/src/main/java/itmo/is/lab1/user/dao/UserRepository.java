package itmo.is.lab1.user.dao;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;

import itmo.is.lab1.user.model.Role;
import itmo.is.lab1.user.model.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
   Optional<User> findByUsername(String username);

   boolean existsByUsername(String username);

   List<User> findAllByRole(Role role);
}
