package com.example.backend.Service;

import com.example.backend.BackendApplication;
import com.example.backend.Model.Class.Cars;
import com.example.backend.Model.Class.Machines;
import com.example.backend.Model.Dto.CarsFiltersDTO;
import com.example.backend.Model.Dto.CountViewDTO;
import com.example.backend.Model.Enum.CarsStatus;
import com.example.backend.Repository.CarsRepository;
import com.example.backend.Utility.TableRequest;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Transient;
import jakarta.persistence.TypedQuery;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Slf4j
@Service
public class CarsService {
    private static final String CACHEABLE = "CARS";
    @Autowired
    private CarsRepository carsRepository;
    @PersistenceContext
    private EntityManager entityManager;

    public void saveAll(List<Cars> cars) {
        this.carsRepository.saveAll(cars);
    }

    public List<Cars> findAll() {
        return this.carsRepository.findAll();
    }

    public Set<String> getAllVin() {
        return carsRepository.findAll().stream().map(Cars::getVin).collect(Collectors.toSet());
    }

    public Set<String> getAllModel() {
        return carsRepository.findAll().stream().map(car -> car.getModel_id().getName()).collect(Collectors.toSet());
    }

    @Transient
    @CacheEvict(cacheNames = CACHEABLE + "findByUsernameAndCarsFilters", allEntries = true)
    public void save(Cars cars) {
        if (cars.getId() == null) {
            cars.setId(BackendApplication.generateId());
        }
        this.carsRepository.save(cars);
    }

    @Caching(evict = {
            @CacheEvict(cacheNames = CACHEABLE + "findByUsernameAndCarsFilters", allEntries = true, key = "#id"),
            @CacheEvict(cacheNames = CACHEABLE + "countByUsernameAndCarsFilters", allEntries = true, key = "#id"),
            @CacheEvict(cacheNames = CACHEABLE + "getExcelByUserNameCarsFilters", allEntries = true, key = "#id"),
            @CacheEvict(cacheNames =   "UsercountInformation", allEntries = true, key = "#id"),
    })
    @Transactional
    public void delete(String id) {
        Cars cars = entityManager.find(Cars.class, id);
        entityManager.remove(cars);
    }

    @Cacheable(cacheNames = CACHEABLE + "findByUsernameAndCarsFilters", key = "((#username != null) ? (#username) : ('ALL_USERS')) + '_' + @tableRequestCacheKeyHelper.buildProcessLogKey(#tableRequest)  +@carsCacheKeyHelper.buildCarsKey(#carsFiltersDTO)")
    public List<Cars> findByUsernameAndCarsFilters(final String username, TableRequest tableRequest, final CarsFiltersDTO carsFiltersDTO) {
        PageRequest pageRequest = BackendApplication.generateTablePage(tableRequest);
        return this.carsRepository.findByUsernameAndCarsFilters(username, pageRequest, carsFiltersDTO.getModel_id_name(), carsFiltersDTO.getModel_id_generation(), carsFiltersDTO.getModel_id_release_year(), carsFiltersDTO.getVin(), carsFiltersDTO.getStatus());
    }

    @Cacheable(cacheNames = CACHEABLE + "countByUsernameAndCarsFilters", key = "((#username != null) ? (#username) : ('ALL_USERS')) +'_' +@carsCacheKeyHelper.buildCarsKey(#carsFiltersDTO)")
    public Long countByUsernameAndCarsFilters(final String username, final CarsFiltersDTO carsFiltersDTO) {
        return this.carsRepository.countByUsernameAndCarsFilters(username, carsFiltersDTO.getModel_id_name(), carsFiltersDTO.getModel_id_generation(), carsFiltersDTO.getModel_id_release_year(), carsFiltersDTO.getVin(), carsFiltersDTO.getStatus());
    }

    @Cacheable(cacheNames = CACHEABLE + "getExcelByUserNameCarsFilters", key = "((#username != null) ? (#username) : ('ALL_USERS')) +'_'+ #columns+'_'+@carsCacheKeyHelper.buildCarsKey(#carsFiltersDTO)")
    public List<Object[]> getExcelByUserNameCarsFilters(final String username, final String columns, final CarsFiltersDTO carsFiltersDTO) {
        TypedQuery<Object[]> query = this.entityManager.createQuery(" SELECT DISTINCT " + columns + Cars.QUERY + CarsFiltersDTO.QUERY, Object[].class);
        query.setParameter("username", username);
        query.setParameter("model_id_release_year", carsFiltersDTO.getModel_id_release_year());
        query.setParameter("status", carsFiltersDTO.getStatus());
        query.setParameter("vin", carsFiltersDTO.getVin());
        query.setParameter("model_id_generation", carsFiltersDTO.getModel_id_generation());
        query.setParameter("model_id_name", carsFiltersDTO.getModel_id_name());
        return BackendApplication.generateDateWithStartTimeAndEndTIme(query.getResultList(), columns);
    }

    @Cacheable(cacheNames = CACHEABLE + "countStatusByCarModelId", key = "#carModelId")
    public List<CountViewDTO> countStatusByCarModelId(final String carModelId) {
        return BackendApplication.generateObjectByStatus(this.carsRepository.countStatusByCarModelId(carModelId), CarsStatus.class);
    }

    @Cacheable(cacheNames = CACHEABLE + "findCarsByVinOrIdOrName", key = "#car_vin_or_id_or_name")
    public Cars findCarsByVinOrIdOrName(final String car_vin_or_id_or_name) {
        return this.carsRepository.findCarsByVinOrIdOrName(car_vin_or_id_or_name).get(0);
    }

    @Transactional
    @CacheEvict(cacheNames = CACHEABLE + "findCarsByVinOrId", key = "#car_vin_or_id +'_' + #status")
    public Integer updateCarsStatus(final String car_vin_or_id, final CarsStatus status) {
        return this.carsRepository.updateCarsStatus(car_vin_or_id, status);
    }

    @Cacheable(cacheNames = CACHEABLE + "canAccessPage", key = "#car_vin_or_id_or_name +'_'+#username")
    public Boolean canAccessPage(final String car_vin_or_id_or_name, final String username) {
        Integer c1 = this.carsRepository.canAccessPageProcessLog(car_vin_or_id_or_name, username);
        Integer c2 = this.carsRepository.canAccessPageCarParts(car_vin_or_id_or_name, username);
        Integer c3 = this.carsRepository.canAccessPageQualityChecks(car_vin_or_id_or_name, username);
        return c1 == 0 && c2 == 0 && c3 == 0;
    }
}
