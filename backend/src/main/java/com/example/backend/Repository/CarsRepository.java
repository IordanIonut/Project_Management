package com.example.backend.Repository;

import com.example.backend.Model.Class.Cars;
import com.example.backend.Model.Dto.CarsFiltersDTO;
import com.example.backend.Model.Enum.CarsStatus;
import com.example.backend.Model.View.CountView;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CarsRepository extends JpaRepository<Cars, String> {
    @Query("SELECT c " + Cars.QUERY + CarsFiltersDTO.QUERY)
    List<Cars> findByUsernameAndCarsFilters(@Param("username") final String username, Pageable pageable, @Param("model_id_name") final String model_id_name, @Param("model_id_generation") final Long model_id_generation, @Param("model_id_release_year") final Long model_id_release_year, @Param("vin") final String vin, @Param("status") final String status);

    @Query("SELECT count(DISTINCT c.id) " + Cars.QUERY + CarsFiltersDTO.QUERY)
    Long countByUsernameAndCarsFilters(@Param("username") final String username, @Param("model_id_name") final String model_id_name, @Param("model_id_generation") final Long model_id_generation, @Param("model_id_release_year") final Long model_id_release_year, @Param("vin") final String vin, @Param("status") final String status);

    @Query("SELECT c.status AS status, COUNT(c.id) AS count FROM Cars c LEFT JOIN CarModel cm ON c.model_id.id = cm.id WHERE cm.id = :carModelId GROUP by c.status")
    List<CountView> countStatusByCarModelId(@Param("carModelId") String carModelId);

    @Query("SELECT c FROM Cars c WHERE LOWER(c.vin) = LOWER(:car_vin_or_id_or_name) OR LOWER(c.id) = LOWER(:car_vin_or_id_or_name) OR LOWER(c.model_id.name) = LOWER(:car_vin_or_id_or_name)")
    List<Cars> findCarsByVinOrIdOrName(@Param("car_vin_or_id_or_name") final String car_vin_or_id_or_name);

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("UPDATE Cars c SET c.status = :status WHERE LOWER(c.vin) = LOWER(:car_vin_or_id) OR LOWER(c.id) = LOWER(:car_vin_or_id)")
    Integer updateCarsStatus(@Param("car_vin_or_id") final String car_vin_or_id, @Param("status") final CarsStatus status);

    @Query("SELECT COUNT(pl.car_id.id) FROM ProcessLog pl WHERE (LOWER(pl.car_id.id) = LOWER(:car_vin_or_id_or_name) " + "OR LOWER(pl.car_id.vin) = LOWER(:car_vin_or_id_or_name)) " + "OR LOWER(pl.car_id.model_id.name) = LOWER(:car_vin_or_id_or_name) AND pl.employee_id.user_id.username = :username")
    Integer canAccessPageProcessLog(@Param("car_vin_or_id_or_name") final String car_vin_or_id_or_name, @Param("username") final String username);

    @Query("SELECT COUNT(cp.car_id.id) FROM CarParts cp WHERE (LOWER(cp.car_id.vin) = LOWER(:car_vin_or_id_or_name) " + "OR LOWER(cp.car_id.model_id.name) = LOWER(:car_vin_or_id_or_name) " + "OR LOWER(cp.car_id.id) = LOWER(:car_vin_or_id_or_name)) AND cp.installed_by.user_id.username = :username")
    Integer canAccessPageCarParts(@Param("car_vin_or_id_or_name") final String car_vin_or_id_or_name, @Param("username") final String username);

    @Query("SELECT COUNT(qc.car_id.id) FROM QualityChecks qc WHERE  (LOWER(qc.car_id.vin) = LOWER(:car_vin_or_id_or_name) " + "OR LOWER(qc.car_id.model_id.name) = LOWER(:car_vin_or_id_or_name) " + "OR LOWER(qc.car_id.id) = LOWER(:car_vin_or_id_or_name)) AND qc.inspector_id.user_id.username = :username")
    Integer canAccessPageQualityChecks(@Param("car_vin_or_id_or_name") final String car_vin_or_id_or_name, @Param("username") final String username);
}
