package itmo.is.lab1.person.model;
/**
 * @author Romariok on 30.09.2024
 */
public enum Color {
   GREEN("GREEN"),
   BLUE("BLUE"),
   WHITE("WHITE"),
   BROWN("BROWN");

   private final String colorName;

   Color(String colorName) {
       this.colorName = colorName;
   }

   public String getColorName() {
       return colorName;
   }
}