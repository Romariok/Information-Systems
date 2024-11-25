package itmo.is.lab1.movie.model;

/**
 * @author Romariok on 30.09.2024
 */
public enum MpaaRating {
   G("G"),
   PG("PG"),
   PG_13("PG_13"),
   R("R"),
   NC_17("NC_17");

   private final String rating;

   MpaaRating(String rating) {
       this.rating = rating;
   }

   public String getRating() {
       return rating;
   }
}