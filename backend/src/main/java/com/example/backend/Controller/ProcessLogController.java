package com.example.backend.Controller;

import com.example.backend.Model.Class.ProcessLog;
import com.example.backend.Model.Dto.FindByRequestDTO;
import com.example.backend.Model.Dto.ProcessLogsFilterDTO;
import com.example.backend.Model.Enum.MachineStatus;
import com.example.backend.Model.Enum.ProcessLogStatus;
import com.example.backend.Service.ProcessLogService;
import com.example.backend.Utility.GroupedResult;
import com.example.backend.Utility.TableRequest;
import jakarta.annotation.Nullable;
import lombok.extern.jbosslog.JBossLog;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.Query;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
@RestController
@RequestMapping("/api/process/log")
@JBossLog
public class ProcessLogController {
    @Autowired
    private ProcessLogService processLogService;

    @PostMapping("/find/by-process-log")
    public ResponseEntity<GroupedResult> getDataByUserNameAndProcessLogIdAndProcessLogFilters(@RequestParam(value = "process_log_id", required = false) final String process_log_id, @RequestParam("username") final String username, @RequestBody FindByRequestDTO request) {
        try {
            log.info("getDataByUserNameAndProcessLogIdAndProcessLogFilters() - Successful.....");
            TableRequest tableRequest = request.getTableRequest();
            ProcessLogsFilterDTO processLogsFilterDTO = request.getProcessLogsFilterDTO();
            return ResponseEntity.ok(new GroupedResult(this.processLogService.getDataByUserNameAndProcessLogIdAndProcessLogFilters(process_log_id, username, tableRequest, processLogsFilterDTO),
                    this.processLogService.countByUserNameAndProcessLogIdAndProcessLogFilters(process_log_id, username, processLogsFilterDTO)));
        } catch (Exception e) {
            log.error("Error in getDataByUserNameAndProcessLogIdAndProcessLogFilters: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/excel/find/by-process-log")
    public ResponseEntity<List<Object[]>> postExcelByUserNameAndProcessLogIdAndProcessLogFilters(@RequestParam(value = "process_log_id", required = false) final String process_log_id, @RequestParam("username") final String username, @RequestParam("columns") final String columns, @RequestBody FindByRequestDTO request) {
        try {
            log.info("postExcelByUserNameAndProcessLogIdAndProcessLogFilters() - Successful.....");
            ProcessLogsFilterDTO processLogsFilterDTO = request.getProcessLogsFilterDTO();
            return ResponseEntity.ok(this.processLogService.postExcelByUserNameAndProcessLogIdAndProcessLogFilters(process_log_id, username, columns, processLogsFilterDTO));
        } catch (Exception e) {
            log.error("Error in postExcelByUserNameAndProcessLogIdAndProcessLogFilters: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/find/by-machine-used")
    public ResponseEntity<GroupedResult> postDataByUsernameAndMachineUsedFilters(@RequestParam("username") final String userName, @RequestBody FindByRequestDTO response) {
        try {
            log.info("postDataByUsernameAndMachineUsedFilters() - Successful.....");
            return ResponseEntity.ok(new GroupedResult(this.processLogService.findByUsernameAndMachineUsedFilters(userName, response.getTableRequest(), response.getMachineUsedFiltersDTO()), this.processLogService.countByUsernameAndMachineUsedFilters(userName, response.getMachineUsedFiltersDTO())));
        } catch (Exception e) {
            log.error("Error in postDataByUsernameAndMachineUsedFilters: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/excel/find/by-machine-used")
    public ResponseEntity<List<Object[]>> postExcelByUserNameAndMachineUsedFilters(@RequestParam("name") final String name, @RequestParam("columns") final String columns, @RequestBody FindByRequestDTO request) {
        try {
            log.info("postExcelByUserNameAndMachineUsedFilters() - Successful.....");
            return ResponseEntity.ok(this.processLogService.postExcelByUserNameAndMachineUsedFilters(name, columns, request.getMachineUsedFiltersDTO()));
        } catch (Exception e) {
            log.error("Error in postExcelByUserNameAndMachineUsedFilters: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/find/by-machine")
    public ResponseEntity<GroupedResult> postDataByMachineNameOrIdAndMachineFilters(@RequestParam("machine_name_or_id") final String machine_name_or_id, @RequestBody FindByRequestDTO request) {
        try {
            log.info("postDataByMachineNameOrIdAndMachineFilters() - Successful.....");
            return ResponseEntity.ok(new GroupedResult(this.processLogService.findByMachineNameOrIdAndMachineFilters(machine_name_or_id, request.getTableRequest(), request.getMachineFiltersDTO()), this.processLogService.countByMachineNameOrIdAndMachineFilters(machine_name_or_id, request.getMachineFiltersDTO())));
        } catch (Exception e) {
            log.error("Error in postDataByMachineNameOrIdAndMachineFilters: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/count/by-machine")
    public ResponseEntity<Long> countByMachineNameOrIdAndMachineFilters(@RequestParam("machine_name_or_id") final String machine_name_or_id, @RequestBody FindByRequestDTO request) {
        try {
            log.info("countByMachineNameOrMachineIdAndMachineFilters() - Successful.....");
            return ResponseEntity.ok(this.processLogService.countByMachineNameOrIdAndMachineFilters(machine_name_or_id, request.getMachineFiltersDTO()));
        } catch (Exception e) {
            log.error("Error in countByMachineNameOrIdAndMachineFilters: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/excel/find/by-machine")
    public ResponseEntity<List<Object[]>> postExcelByMachineNameOrIdAndMachineFilters(@RequestParam("machine_name_or_id") final String machine_name_or_id, @RequestParam("columns") final String columns, @RequestBody FindByRequestDTO request) {
        try {
            log.info("postExcelByMachineNameOrIdAndMachineFilters() - Successful.....");
            return ResponseEntity.ok(this.processLogService.postExcelByMachineNameOrIdAndMachineFilters(machine_name_or_id, columns, request.getMachineFiltersDTO()));
        } catch (Exception e) {
            log.error("Error in postExcelByMachineNameOrIdAndMachineFilters: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/find/by")
    public ResponseEntity<ProcessLog> findProcessByNameOrId(@RequestParam("process_name_or_id") final String process_name_or_id) {
        try {
            log.info("findProcessByNameOrId() - Successful.....");
            return ResponseEntity.ok(this.processLogService.findProcessByNameOrId(process_name_or_id));
        } catch (Exception e) {
            log.error("Error in findProcessByNameOrId: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/put/status")
    public ResponseEntity<Integer> updateProcessLogStatus(@RequestParam("process_name_or_id") final String process_name_or_id, @RequestParam("status") final ProcessLogStatus status) {
        try {
            log.info("updateProcessLogStatus() - Successful.....");
            return ResponseEntity.ok(this.processLogService.updateProcessLogStatus(process_name_or_id, status));
        } catch (Exception e) {
            log.error("Error in updateProcessLogStatus: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/can-access")
    public ResponseEntity<Boolean> canAccessPage(@RequestParam("process_name_or_id") final String process_name_or_id, @RequestParam("username") final String username) {
        try {
            log.info("canAccessPage() - Successful.....");
            return ResponseEntity.ok(this.processLogService.canAccessPage(process_name_or_id, username));
        } catch (Exception e) {
            log.error("Error in canAccessPage: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
