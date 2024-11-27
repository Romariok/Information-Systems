package itmo.is.lab1.yaml_import.model;

public enum OperationStatus {
   SUCCESS("SUCCESS"),
   FAILURE("FAILURE");

   private final String status;

   OperationStatus(String status) {
      this.status = status;
   }

   public String getStatus() {
      return status;
   }
}
