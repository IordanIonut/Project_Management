package com.example.backend.Service;

import com.example.backend.BackendApplication;
import com.example.backend.Model.Class.Cars;
import com.example.backend.Model.Class.ProcessLog;
import com.example.backend.Model.Dto.MachineFiltersDTO;
import com.example.backend.Model.Dto.MachineUsedFiltersDTO;
import com.example.backend.Model.Dto.ProcessLogsFilterDTO;
import com.example.backend.Model.Enum.ProcessLogStatus;
import com.example.backend.Repository.ProcessLogRepository;
import com.example.backend.Utility.TableRequest;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import jakarta.transaction.Transactional;
import lombok.extern.jbosslog.JBossLog;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@JBossLog
public class ProcessLogService {
    private static final String CACHEABLE = "Process_Log";
    @Autowired
    private ProcessLogRepository processLogRepository;
    @PersistenceContext
    private EntityManager entityManager;

    public void saveAll(List<ProcessLog> processLogs) {
        this.processLogRepository.saveAll(processLogs);
    }

    public List<ProcessLog> findAll() {
        return this.processLogRepository.findAll();
    }

    @Cacheable(cacheNames = CACHEABLE + "getDataByUserNameAndProcessLogIdAndProcessLogFilters", key = "#process_log_id +'_'+ #username + @tableRequestCacheKeyHelper.buildProcessLogKey(#tableRequest) + @processLogsCacheKeyHelper.buildProcessLogKey(#processLogsFilterDTO)")
    public List<ProcessLog> getDataByUserNameAndProcessLogIdAndProcessLogFilters(final String process_log_id, final String username, final TableRequest tableRequest, final ProcessLogsFilterDTO processLogsFilterDTO) {
        PageRequest pageRequest = BackendApplication.generateTablePage(tableRequest);
        return this.processLogRepository.findByUserNameAndProcessLogIdAndProcessLogFilters(process_log_id, username, pageRequest, processLogsFilterDTO.getStatus(), processLogsFilterDTO.getProcess_id_name(), processLogsFilterDTO.getMachine_id_name(), processLogsFilterDTO.getStart_date(), processLogsFilterDTO.getEnd_date());
    }

    @Cacheable(cacheNames = CACHEABLE + "countByUserNameAndProcessLogIdAndProcessLogFilters", key = "#process_log_id +'_' + #username + @processLogsCacheKeyHelper.buildProcessLogKey(#processLogsFilterDTO)")
    public Long countByUserNameAndProcessLogIdAndProcessLogFilters(final String process_log_id, final String username, final ProcessLogsFilterDTO processLogsFilterDTO) {
        return this.processLogRepository.countByUserNameAndProcessLogIdAndProcessLogFilters(process_log_id, username, processLogsFilterDTO.getStatus(), processLogsFilterDTO.getProcess_id_name(), processLogsFilterDTO.getMachine_id_name(), processLogsFilterDTO.getStart_date(), processLogsFilterDTO.getEnd_date());
    }

    @Cacheable(cacheNames = CACHEABLE + "postExcelByUserNameAndProcessLogIdAndProcessLogFilters", key = "#process_log_id +'_'+ #username +'_' +#columns + @processLogsCacheKeyHelper.buildProcessLogKey(#processLogsFilterDTO)")
    public List<Object[]> postExcelByUserNameAndProcessLogIdAndProcessLogFilters(final String process_log_id, final String username, final String columns, final ProcessLogsFilterDTO processLogsFilterDTO) {
        TypedQuery<Object[]> query = this.entityManager.createQuery("SELECT " + columns + ProcessLog.QUERY_BY_USERNAME_OR_PROCESS_NAME + ProcessLogsFilterDTO.QUERY, Object[].class);
        query.setParameter("process_log_id", process_log_id);
        query.setParameter("username", username);
        query.setParameter("status", processLogsFilterDTO.getStatus());
        query.setParameter("process_id_name", processLogsFilterDTO.getProcess_id_name());
        query.setParameter("machine_id_name", processLogsFilterDTO.getMachine_id_name());
        query.setParameter("start_date", processLogsFilterDTO.getStart_date());
        query.setParameter("end_date", processLogsFilterDTO.getEnd_date());
        return BackendApplication.generateDateWithStartTimeAndEndTIme(query.getResultList(), columns);
    }

    @Cacheable(cacheNames = CACHEABLE + "findByUsernameAndMachineUsedFilters", key = "#username  + @tableRequestCacheKeyHelper.buildProcessLogKey(#tableRequest)  +@machineUsedCacheKeyHelper.buildMachineUsedKey(#machineUsedFiltersDTO)")
    public List<ProcessLog> findByUsernameAndMachineUsedFilters(final String username, final TableRequest tableRequest, final MachineUsedFiltersDTO machineUsedFiltersDTO) {
        PageRequest pageRequest = BackendApplication.generateTablePage(tableRequest);
        return this.processLogRepository.findByUsernameAndMachineUsedFilters(username, pageRequest, machineUsedFiltersDTO.getMachine_id_name(),
                machineUsedFiltersDTO.getMachine_id_status(), machineUsedFiltersDTO.getCar_id_model_id_name(), machineUsedFiltersDTO.getStatus(),
                machineUsedFiltersDTO.getProcess_id_name(), machineUsedFiltersDTO.getEmployee_id_user_id_username());
    }

    @Cacheable(cacheNames = CACHEABLE + "countByUsernameAndMachineUsedFilters", key = "#username + @machineUsedCacheKeyHelper.buildMachineUsedKey(#machineUsedFiltersDTO)")
    public Long countByUsernameAndMachineUsedFilters(final String username, final MachineUsedFiltersDTO machineUsedFiltersDTO) {
        return this.processLogRepository.countByUsernameAndMachineUsedFilters(username, machineUsedFiltersDTO.getMachine_id_name(),
                machineUsedFiltersDTO.getMachine_id_status(), machineUsedFiltersDTO.getCar_id_model_id_name(), machineUsedFiltersDTO.getStatus(),
                machineUsedFiltersDTO.getProcess_id_name(), machineUsedFiltersDTO.getEmployee_id_user_id_username());
    }

    @Cacheable(cacheNames = CACHEABLE + "postExcelByUserNameAndMachineUsedFilters", key = "#username +'_' +#columns + @machineUsedCacheKeyHelper.buildMachineUsedKey(#machineUsedFiltersDTO)")
    public List<Object[]> postExcelByUserNameAndMachineUsedFilters(final String username, final String columns, final MachineUsedFiltersDTO machineUsedFiltersDTO) {
        TypedQuery<Object[]> query = this.entityManager.createQuery("SELECT " + columns + ProcessLog.QUERY_MACHINE_USED_FILTERS + MachineUsedFiltersDTO.QUERY, Object[].class);
        query.setParameter("username", username);
        query.setParameter("machine_id_name", machineUsedFiltersDTO.getMachine_id_name());
        query.setParameter("machine_id_status", machineUsedFiltersDTO.getMachine_id_status());
        query.setParameter("car_id_model_id_name", machineUsedFiltersDTO.getCar_id_model_id_name());
        query.setParameter("status", machineUsedFiltersDTO.getStatus());
        query.setParameter("process_id_name", machineUsedFiltersDTO.getProcess_id_name());
        query.setParameter("employee_id_user_id_username", machineUsedFiltersDTO.getEmployee_id_user_id_username());
        return BackendApplication.generateDateWithStartTimeAndEndTIme(query.getResultList(), columns);
    }

    @Cacheable(cacheNames = CACHEABLE + "findByMachineNameOrIdAndMachineFilters", key = "#machine_name_or_id +'_'+ @tableRequestCacheKeyHelper.buildProcessLogKey(#tableRequest) + @machineCacheKeyHelper.buildMachineKey(#machineFiltersDTO)")
    public List<ProcessLog> findByMachineNameOrIdAndMachineFilters(final String machine_name_or_id, final TableRequest tableRequest, final MachineFiltersDTO machineFiltersDTO) {
        PageRequest pageRequest = BackendApplication.generateTablePage(tableRequest);
        return this.processLogRepository.findByMachineNameOrIdAndMachineFilters(machine_name_or_id, pageRequest,
                machineFiltersDTO.getEmployee_id_user_id_username(), machineFiltersDTO.getEmployee_id_user_id_role(), machineFiltersDTO.getProcess_id_name(),
                machineFiltersDTO.getEmployee_id_department(), machineFiltersDTO.getStart_time(), machineFiltersDTO.getEnd_time(), machineFiltersDTO.getStatus());
    }

    @Cacheable(cacheNames = CACHEABLE + "countByMachineNameOrIdAndMachineFilters", key = "#machine_name_or_id + @machineCacheKeyHelper.buildMachineKey(#machineFiltersDTO)")
    public Long countByMachineNameOrIdAndMachineFilters(final String machine_name_or_id, final MachineFiltersDTO machineFiltersDTO) {
        return this.processLogRepository.countByMachineNameOrIdAndMachineFilters(machine_name_or_id, machineFiltersDTO.getEmployee_id_user_id_username(), machineFiltersDTO.getEmployee_id_user_id_role(), machineFiltersDTO.getProcess_id_name(),
                machineFiltersDTO.getEmployee_id_department(), machineFiltersDTO.getStart_time(), machineFiltersDTO.getEnd_time(), machineFiltersDTO.getStatus());
    }

    @Cacheable(cacheNames = CACHEABLE + "postExcelByMachineNameOrIdAndMachineFilters", key = "#machine_name_or_id + '_' + #columns + @machineCacheKeyHelper.buildMachineKey(#machineFiltersDTO)")
    public List<Object[]> postExcelByMachineNameOrIdAndMachineFilters(final String machine_name_or_id, final String columns, final MachineFiltersDTO machineFiltersDTO) {
        TypedQuery<Object[]> query = this.entityManager.createQuery("SELECT " + columns + ProcessLog.QUERY_MACHINE + MachineFiltersDTO.QUERY, Object[].class);
        query.setParameter("machine_name_or_id", machine_name_or_id);
        query.setParameter("employee_id_user_id_username", machineFiltersDTO.getEmployee_id_user_id_username());
        query.setParameter("employee_id_user_id_role", machineFiltersDTO.getEmployee_id_user_id_role());
        query.setParameter("process_id_name", machineFiltersDTO.getProcess_id_name());
        query.setParameter("employee_id_department", machineFiltersDTO.getEmployee_id_department());
        query.setParameter("start_time", machineFiltersDTO.getStart_time());
        query.setParameter("end_time", machineFiltersDTO.getEnd_time());
        query.setParameter("status", machineFiltersDTO.getStatus());

        return query.getResultList();
    }

    @Cacheable(cacheNames = CACHEABLE + "findProcessByNameOrId", key = "#process_name_or_id")
    public ProcessLog findProcessByNameOrId(final String process_name_or_id) {
        return this.processLogRepository.findProcessByNameOrId(process_name_or_id);
    }

    @Transactional
    @CacheEvict(cacheNames = CACHEABLE + "findProcessByNameOrId", key = "#process_name_or_id  ")
    public Integer updateProcessLogStatus(final String process_name_or_id, final ProcessLogStatus status) {
        return this.processLogRepository.updateProcessLogStatus(process_name_or_id, status);
    }

    @Cacheable(cacheNames = CACHEABLE + "canAccessPage", key = "#process_name_or_id +'_' + #username")
    public Boolean canAccessPage(final String process_name_or_id, final String username) {
        return this.processLogRepository.canAccessPage(process_name_or_id, username) == 0;
    }
}
