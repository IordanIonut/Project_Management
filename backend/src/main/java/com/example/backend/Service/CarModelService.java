package com.example.backend.Service;

import com.example.backend.BackendApplication;
import com.example.backend.Model.Class.CarModel;
import com.example.backend.Model.Class.Cars;
import com.example.backend.Model.Class.Suppliers;
import com.example.backend.Model.Dto.CarModelFilterDTO;
import com.example.backend.Repository.CarModelRepository;
import com.example.backend.Utility.TableRequest;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Transient;
import jakarta.persistence.TypedQuery;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class CarModelService {
    private static final String CACHEABLE = "CAR_MODEL";
    @Autowired
    private CarModelRepository carModelRepository;
    @PersistenceContext
    private EntityManager entityManager;

    public void saveAll(List<CarModel> carModels) {
        this.carModelRepository.saveAll(carModels);
    }

    public List<CarModel> findAll() {
        return this.carModelRepository.findAll();
    }

    @Cacheable(cacheNames = CACHEABLE + "findByName", key = "#name")
    public List<CarModel> findByName(final String name) {
        return this.carModelRepository.findByName(name, BackendApplication.generatePaginateOfSearch());
    }

    @Cacheable(cacheNames = CACHEABLE + "findAllCarModels")
    public List<CarModel> findAllCarModels() {
        return this.carModelRepository.findAllCarModels();
    }

    @Cacheable(cacheNames = CACHEABLE + "findCarModelByCarModelFilter", key = "@tableRequestCacheKeyHelper.buildProcessLogKey(#tableRequest) + @carModelCacheKeyHelper.buildCarModelKey(#carModelFilterDTO)")
    public List<CarModel> findCarModelByCarModelFilter(TableRequest tableRequest, CarModelFilterDTO carModelFilterDTO) {
        Pageable pageable = BackendApplication.generateTablePage(tableRequest);
        return this.carModelRepository.findCarModelByCarModelFilter(pageable, carModelFilterDTO.getName(), carModelFilterDTO.getGeneration(), carModelFilterDTO.getRelease_year());
    }

    @Cacheable(cacheNames = CACHEABLE + "countCarModelByCarModelFilter", key = "@carModelCacheKeyHelper.buildCarModelKey(#carModelFilterDTO)")
    public Long countCarModelByCarModelFilter(CarModelFilterDTO carModelFilterDTO) {
        return this.carModelRepository.countCarModelByCarModelFilter(carModelFilterDTO.getName(), carModelFilterDTO.getGeneration(), carModelFilterDTO.getRelease_year());
    }

    @Cacheable(cacheNames = CACHEABLE + "excelCarModelByCarModelFilter", key = "#column + '_' + @carModelCacheKeyHelper.buildCarModelKey(#carModelFilterDTO)")
    public List<Object[]> excelCarModelByCarModelFilter(String column, CarModelFilterDTO carModelFilterDTO) {
        TypedQuery<Object[]> query = this.entityManager.createQuery("SELECT " + column + " FROM CarModel cm " + CarModelFilterDTO.QUERY, Object[].class);
        query.setParameter("name", carModelFilterDTO.getName());
        query.setParameter("generation", carModelFilterDTO.getGeneration());
        query.setParameter("release_year", carModelFilterDTO.getRelease_year());
        return query.getResultList();
    }

    public Set<String> getAllName() {
        return carModelRepository.findAll().stream()
                .map(CarModel::getName)
                .collect(Collectors.toSet());
    }

    @Transient
    @Caching(evict = {
            @CacheEvict(cacheNames = CACHEABLE + "findCarModelByCarModelFilter", allEntries = true, key = "#carModel"),
            @CacheEvict(cacheNames = CACHEABLE + "countCarModelByCarModelFilter", allEntries = true, key = "#carModel"),
            @CacheEvict(cacheNames = CACHEABLE + "excelCarModelByCarModelFilter", allEntries = true, key = "#carModel"),
            @CacheEvict(cacheNames =   "UsercountInformation", allEntries = true, key = "#carModel"),
    })
    public void save(CarModel carModel) {
        if (carModel.getId() == null) {
            carModel.setId(BackendApplication.generateId());
        }
        this.carModelRepository.save(carModel);
    }

    @Caching(evict = {
            @CacheEvict(cacheNames = CACHEABLE + "findCarModelByCarModelFilter", allEntries = true, key = "#id"),
            @CacheEvict(cacheNames = CACHEABLE + "countCarModelByCarModelFilter", allEntries = true, key = "#id"),
            @CacheEvict(cacheNames = CACHEABLE + "excelCarModelByCarModelFilter", allEntries = true, key = "#id"),
            @CacheEvict(cacheNames =   "UsercountInformation", allEntries = true, key = "#id"),
    })
    @Transactional
    public void delete(String id) {
        CarModel carModel = entityManager.find(CarModel.class, id);
        entityManager.remove(carModel);
    }
}
