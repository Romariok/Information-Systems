package itmo.is.lab1.yaml_import.model;

import java.time.LocalDateTime;

import itmo.is.lab1.user.model.User;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "import_history")
@Builder(toBuilder = true)
@NoArgsConstructor
@AllArgsConstructor
@Data
public class ImportHistory {
   @Id
   @GeneratedValue(strategy = GenerationType.IDENTITY)
   private Long id;

   @Column(name = "status", nullable = false)
   @Enumerated(EnumType.STRING)
   private OperationStatus status;

   @Column(name = "import_time", nullable = false)
   private LocalDateTime importTime;

   @Column(name = "imported_count")
   private Integer importedCount;

   @Column(name = "file_url", length = 1024)
   private String fileUrl;

   @ManyToOne(fetch = FetchType.EAGER)
   @JoinColumn(name = "user_id")
   private User user;
}
