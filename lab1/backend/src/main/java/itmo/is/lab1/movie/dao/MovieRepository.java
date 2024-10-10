package itmo.is.lab1.movie.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import itmo.is.lab1.movie.model.Movie;
import itmo.is.lab1.coordinates.model.Coordinates;
import itmo.is.lab1.person.model.Person;
import itmo.is.lab1.user.model.User;
import itmo.is.lab1.movie.model.MovieGenre;

import java.util.List;

@Repository
public interface MovieRepository extends JpaRepository<Movie, Long> {
      List<Movie> findAllByUser(User user);

      List<Movie> findAllByCoordinates(Coordinates coordinates);

      @Query("SELECT m FROM Movie m WHERE m.operator = :person OR m.director = :person OR m.screenwriter = :person")
      List<Movie> findAllByPerson(Person person);

      List<Movie> findAllByUsaBoxOfficeLessThan(long usaBoxOffice);

      @Query("SELECT m.director, COUNT(m) FROM Movie m GROUP BY m.director")
      List<Object[]> countMoviesByDirector();

      @Query("SELECT m FROM Movie m WHERE m.tagline LIKE %:substring%")
      List<Movie> findAllByTaglineContaining(String substring);

      @Query("SELECT m FROM Movie m WHERE m.oscarsCount = 0")
      List<Movie> findMoviesWithNoOscars();

      @Query("SELECT DISTINCT m FROM Movie m WHERE m.director IN " +
           "(SELECT DISTINCT m2.director FROM Movie m2 WHERE m2.genre = :genre)")
      List<Movie> findMoviesByDirectorsWithMoviesInGenre(MovieGenre genre);
}
