package itmo.is.lab1.person.model;

/**
 * @author Romariok on 30.09.2024
 */
public enum Country {
   RUSSIA("RUSSIA"),
   UNITED_KINGDOM("UNITED_KINGDOM"),
   VATICAN("VATICAN"),
   ITALY("ITALY"),
   THAILAND("THAILAND");

   private final String countryName;

   Country(String countryName) {
       this.countryName = countryName;
   }

   public String getCountryName() {
       return countryName;
   }
}