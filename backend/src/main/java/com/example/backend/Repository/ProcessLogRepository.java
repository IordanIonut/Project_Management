package com.example.backend.Repository;

import com.example.backend.Model.Class.ProcessLog;
import com.example.backend.Model.Dto.MachineFiltersDTO;
import com.example.backend.Model.Dto.MachineUsedFiltersDTO;
import com.example.backend.Model.Dto.ProcessLogsFilterDTO;
import com.example.backend.Model.Enum.MachineStatus;
import com.example.backend.Model.Enum.ProcessLogStatus;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ProcessLogRepository extends JpaRepository<ProcessLog, String> {
    @Query("SELECT p " + ProcessLog.QUERY_BY_USERNAME_OR_PROCESS_NAME + ProcessLogsFilterDTO.QUERY)
    List<ProcessLog> findByUserNameAndProcessLogIdAndProcessLogFilters(@Param("process_log_id") final String process_log_id, @Param("username") final String username, Pageable pageable, @Param("status") final String status, @Param("process_id_name") final String process_id_name, @Param("machine_id_name") final String machine_id_name, @Param("start_date") final LocalDateTime start_date, @Param("end_date") LocalDateTime end_date);

    @Query("SELECT count(p.id) " + ProcessLog.QUERY_BY_USERNAME_OR_PROCESS_NAME + ProcessLogsFilterDTO.QUERY)
    Long countByUserNameAndProcessLogIdAndProcessLogFilters(@Param("process_log_id") final String process_log_id, @Param("username") final String username, @Param("status") final String status, @Param("process_id_name") final String process_id_name, @Param("machine_id_name") final String machine_id_name, @Param("start_date") final LocalDateTime start_date, @Param("end_date") LocalDateTime end_date);

    @Query("SELECT pl " + ProcessLog.QUERY_MACHINE_USED_FILTERS + MachineUsedFiltersDTO.QUERY)
    List<ProcessLog> findByUsernameAndMachineUsedFilters(@Param("username") final String username, Pageable pageable, @Param("machine_id_name") final String machine_id_name, @Param("machine_id_status") final String machine_id_status, @Param("car_id_model_id_name") final String car_id_model_id_name, @Param("status") final String status, @Param("process_id_name") final String process_id_name, @Param("employee_id_user_id_username") final String employee_id_user_id_username);

    @Query("SELECT count(pl.id)" + ProcessLog.QUERY_MACHINE_USED_FILTERS + MachineUsedFiltersDTO.QUERY)
    Long countByUsernameAndMachineUsedFilters(@Param("username") final String username, @Param("machine_id_name") final String machine_id_name, @Param("machine_id_status") final String machine_id_status, @Param("car_id_model_id_name") final String car_id_model_id_name, @Param("status") final String status, @Param("process_id_name") final String process_id_name, @Param("employee_id_user_id_username") final String employee_id_user_id_username);

    @Query("SELECT p" + ProcessLog.QUERY_MACHINE + MachineFiltersDTO.QUERY)
    List<ProcessLog> findByMachineNameOrIdAndMachineFilters(@Param("machine_name_or_id") final String machine_name_or_id, Pageable pageable, @Param("employee_id_user_id_username") final String employee_id_user_id_username, @Param("employee_id_user_id_role") final String employee_id_user_id_role, @Param("process_id_name") final String process_id_name, @Param("employee_id_department") final String employee_id_department, @Param("start_time") final LocalDate start_time, @Param("end_time") final LocalDate end_time, @Param("status") final String status);

    @Query("SELECT count(p)" + ProcessLog.QUERY_MACHINE + MachineFiltersDTO.QUERY)
    Long countByMachineNameOrIdAndMachineFilters(@Param("machine_name_or_id") final String machine_name_or_id, @Param("employee_id_user_id_username") final String employee_id_user_id_username, @Param("employee_id_user_id_role") final String employee_id_user_id_role, @Param("process_id_name") final String process_id_name, @Param("employee_id_department") final String employee_id_department, @Param("start_time") final LocalDate start_time, @Param("end_time") final LocalDate end_time, @Param("status") final String status);

    @Query("SELECT p FROM ProcessLog p WHERE LOWER(p.id) = :process_name_or_id OR LOWER(p.process_id.name) = :process_name_or_id")
    ProcessLog findProcessByNameOrId(@Param("process_name_or_id") final String process_name_or_id);

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("UPDATE ProcessLog pl SET pl.status = :status WHERE LOWER(pl.process_id) = LOWER(:process_name_or_id) OR LOWER(pl.id) = LOWER(:process_name_or_id)")
    Integer updateProcessLogStatus(@Param("process_name_or_id") String process_name_or_id, @Param("status") ProcessLogStatus status);

    @Query("SELECT Count(pl.id) FROM ProcessLog pl WHERE (LOWER(pl.id) = LOWER(:process_name_or_id) OR LOWER(pl.process_id.name) = LOWER(:process_name_or_id)) AND pl.employee_id.user_id.username = :username")
    Long canAccessPage(@Param("process_name_or_id") final String process_name_or_id, @Param("username") final String username);

    @Query("SELECT pl FROM ProcessLog pl WHERE LOWER(pl.process_id.id) LIKE LOWER(:process_id) ")
    List<ProcessLog> findByProcessAndProcessFilters(@Param("process_id") final String process_id);
}