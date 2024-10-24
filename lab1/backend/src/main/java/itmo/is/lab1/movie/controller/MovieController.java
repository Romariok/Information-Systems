package itmo.is.lab1.movie.controller;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import itmo.is.lab1.movie.dto.*;
import itmo.is.lab1.movie.model.MovieGenre;
import itmo.is.lab1.movie.service.MovieService;

import java.util.List;

@RestController
@RequestMapping("/movie")
@RequiredArgsConstructor
public class MovieController {
   private final MovieService movieService;

   @GetMapping
   public List<MovieDTO> getMoviePage(@RequestParam int from, @RequestParam int size) {
      return movieService.getMoviePage(from, size);
   }

   @GetMapping("/all")
   public List<MovieDTO> getMovie() {
      return movieService.getMovie();
   }

   @GetMapping("/count/director")
   public List<Object[]> countMoviesByDirector() {
      return movieService.countMoviesByDirector();
   }

   @GetMapping("/tagline/{substring}")
   public List<MovieDTO> getMoviesTaglineContaining(@PathVariable String substring) {
      return movieService.getMoviesTaglineContaining(substring);
   }

   @GetMapping("/usa-box-office/less/{usaBoxOffice}")
   public List<MovieDTO> findMoviesUsaBoxOfficeLess(@PathVariable long usaBoxOffice) {
      return movieService.findMoviesUsaBoxOfficeLess(usaBoxOffice);
   }

   @GetMapping("/no-oscars")
   public List<MovieDTO> findMoviesWithNoOscars() {
      return movieService.findMoviesWithNoOscars();
   }

   @PostMapping
   public MovieDTO createMovie(@RequestBody @Valid CreateMovieDTO createMovieDTO, HttpServletRequest request) {
      return movieService.createMovie(createMovieDTO, request);
   }

   @PostMapping("/remove-oscars")
   public void removeOscarsFromDirectorsWithMoviesInGenre(@RequestParam MovieGenre genre, HttpServletRequest request) {
      movieService.removeOscarsFromDirectorsWithMoviesInGenre(genre, request);
   }

   @PatchMapping("/{movieId}")
   public MovieDTO alterMovie(@PathVariable Long movieId, @Valid @RequestBody AlterMovieDTO alterMovieDTO,
         HttpServletRequest request) {
      return movieService.alterMovie(movieId, alterMovieDTO, request);
   }

   @DeleteMapping("/{movieId}")
   public void deleteMovie(@PathVariable Long movieId, HttpServletRequest request) {
      movieService.deleteMovie(movieId, request);
   }
   
}
