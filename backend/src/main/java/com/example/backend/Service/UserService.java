package com.example.backend.Service;

import com.example.backend.BackendApplication;
import com.example.backend.Model.Class.Employees;
import com.example.backend.Model.Class.PartProduction;
import com.example.backend.Model.Class.User;
import com.example.backend.Model.Dto.*;
import com.example.backend.Repository.UserRepository;
import com.example.backend.Utility.TableRequest;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.awt.print.Pageable;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class UserService {
    private static final String CACHEABLE = "User";
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ProcessLogService processLogService;
    @Autowired
    private CarsService carsService;
    @Autowired
    private QualityChecksService qualityChecksService;
    @Autowired
    private CarsPartsService carsPartsService;
    @Autowired
    private PartProductionService partProductionService;
    @Autowired
    private EmployeesService employeesService;
    @Autowired
    private MachinesService machinesService;
    @Autowired
    private PasswordEncoder passwordEncoder;

    @PersistenceContext
    private EntityManager entityManager;

    public void saveAll(List<User> users) {
        this.userRepository.saveAll(users);
    }

    public List<User> finaAll() {
        return this.userRepository.findAll();
    }

    public Optional<User> findByEmail(final String email) {
        return this.userRepository.findByEmail(email);
    }

    public Set<String> getAllEmails() {
        return userRepository.findAll().stream().map(User::getEmail).collect(Collectors.toSet());
    }

    @Cacheable(cacheNames = CACHEABLE + "countInformation", key = "#name + '_' + #machine_name_or_id")
    public UserInformationDTO countInformation(final String name, final String machine_name_or_id) {
        return new UserInformationDTO(this.processLogService.countByUserNameAndProcessLogFilters(name, new ProcessLogsFilterDTO()),
                this.carsService.countByUsernameAndCarsFilters(name, new CarsFiltersDTO()),
                this.qualityChecksService.countByUserName(name, new QualityChecksFiltersDTO()),
                this.carsPartsService.countByUserNameAndCarsPartsFilters(name, new CarsPartsFiltersDTO()),
                this.processLogService.countByUsernameAndMachineUsedFilters(name, new MachineUsedFiltersDTO()),
                this.partProductionService.countByMachineNameOrIdAndPartProductionFilter(machine_name_or_id, new PartProductionFiltersDTO()),
                this.processLogService.countByMachineNameOrIdAndMachineFilters(machine_name_or_id, new MachineFiltersDTO()),
                this.countAllByUserAllFilters(new UserAllFiltersDTO()), this.machinesService.countAllBy(new MachineAllFiltersDTO()));
    }

    @Cacheable(cacheNames = CACHEABLE + "findUserByUsernameOrId", key = "#user_username_or_id_or_email")
    public User findUserByUsernameOrId(final String user_username_or_id_or_email) {
        return this.userRepository.findUserByUsernameOrId(user_username_or_id_or_email);
    }

    @Cacheable(cacheNames = CACHEABLE + "canAccessPage", key = "#user_username_or_id_or_email")
    public Boolean canAccessPage(final String user_username_or_id_or_email) {
        return this.userRepository.canAccessQualityCheck(user_username_or_id_or_email) == 0 && this.userRepository.canAccessProcessLog(user_username_or_id_or_email) == 0 && this.userRepository.canAccessCarParts(user_username_or_id_or_email) == 0;
    }

    @Cacheable(cacheNames = CACHEABLE + "findUsersByUsername", key = "#user_username")
    public List<User> findUsersByUsername(final String user_username) {
        return this.userRepository.findUsersByUsername(user_username, BackendApplication.generatePaginateOfSearch());
    }

    public void save(User user) {
        user.setId(BackendApplication.generateId());
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        Employees emp = user.getEmployees_id();
        emp.setId(BackendApplication.generateId());
        emp.setUser_id(user);

        employeesService.save(emp);
        userRepository.save(user);
    }

    @Cacheable(cacheNames = CACHEABLE + "findAllByUserAllFilters", key = "@tableRequestCacheKeyHelper.buildProcessLogKey(#tableRequest) + @usersAllCacheKeyHelper.buildUserAllKey(#userAllFiltersDTO)")
    public List<User> findAllByUserAllFilters(TableRequest tableRequest, UserAllFiltersDTO userAllFiltersDTO) {
        PageRequest pageRequest = BackendApplication.generateTablePage(tableRequest);
        return this.userRepository.findAllByUserAllFilters(pageRequest, userAllFiltersDTO.getUsername(), userAllFiltersDTO.getEmail(), userAllFiltersDTO.getRole(), userAllFiltersDTO.getEmployees_id_name());
    }

    @Cacheable(cacheNames = CACHEABLE + "countAllByUserAllFilters", key = "@usersAllCacheKeyHelper.buildUserAllKey(#userAllFiltersDTO)")
    public Long countAllByUserAllFilters(UserAllFiltersDTO userAllFiltersDTO) {
        return this.userRepository.countAllByUserAllFilters(userAllFiltersDTO.getUsername(), userAllFiltersDTO.getEmail(), userAllFiltersDTO.getRole(), userAllFiltersDTO.getEmployees_id_name());
    }

    @Cacheable(cacheNames = CACHEABLE + "excelAllByUserAllFilters", key = "@usersAllCacheKeyHelper.buildUserAllKey(#userAllFiltersDTO)")
    public List<Object[]> excelAllByUserAllFilters(String columns, UserAllFiltersDTO userAllFiltersDTO) {
        TypedQuery<Object[]> query = this.entityManager.createQuery("SELECT " + columns + " FROM User u WHERE 1 = 1 " + UserAllFiltersDTO.QUERY, Object[].class);
        query.setParameter("username", userAllFiltersDTO.getUsername());
        query.setParameter("email", userAllFiltersDTO.getEmail());
        query.setParameter("role", userAllFiltersDTO.getRole());
        query.setParameter("employees_id_name", userAllFiltersDTO.getEmployees_id_name());
        return query.getResultList();
    }
}
