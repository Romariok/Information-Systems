package itmo.is.lab1.movie.model;

/**
 * @author Romariok on 30.09.2024
 */
public enum MovieGenre {
   DRAMA("DRAMA"),
   ADVENTURE("ADVENTURE"),
   HORROR("HORROR"),
   FANTASY("FANTASY");

   private final String genre;

   MovieGenre(String genre) {
       this.genre = genre;
   }

   public String getGenre() {
       return genre;
   }
}