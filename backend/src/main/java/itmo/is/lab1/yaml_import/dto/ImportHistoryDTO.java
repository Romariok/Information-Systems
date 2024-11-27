package itmo.is.lab1.yaml_import.dto;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonFormat;

import itmo.is.lab1.yaml_import.model.OperationStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ImportHistoryDTO {
   private Long id;
   private OperationStatus status;
   @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
   private LocalDateTime importTime;
   private int importedCount;
   private Long userId;
}
