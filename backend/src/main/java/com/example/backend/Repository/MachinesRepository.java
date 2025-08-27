package com.example.backend.Repository;

import com.example.backend.Model.Class.Machines;
import com.example.backend.Model.Dto.MachineAllFiltersDTO;
import com.example.backend.Model.Enum.MachineStatus;
import com.example.backend.Model.View.CountView;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface MachinesRepository extends JpaRepository<Machines, String> {
    @Query("""
            SELECT pl.status AS status, COUNT(pl) AS count
            FROM ProcessLog  pl JOIN Cars c ON pl.car_id.id = c.id
            JOIN CarModel c_model ON c.model_id.id = c_model.id
            JOIN Machines m ON pl.machine_id.id = m.id
            WHERE m.id = :machineId
            GROUP BY pl.status
            """)
    List<CountView> countStatusByMachineId(@Param("machineId") String machineId);

    @Query("SELECT m FROM Machines m WHERE m.id = :machine_name_or_id OR m.name = :machine_name_or_id")
    Machines findMachinesByNameOrId(@Param("machine_name_or_id") final String key);

    @Query("SELECT count(pp.id) FROM PartProduction pp LEFT JOIN CarParts cp ON cp.part_id.id = pp.part_id.id WHERE " + "(LOWER(pp" + ".machine_id.name) = LOWER(:machine_name_or_id) OR LOWER(pp.machine_id.id) = LOWER" + "(:machine_name_or_id)) AND cp.installed_by.user_id.username = :username")
    Long countPartProductionByMachineNameOrIdAndUsername(@Param("machine_name_or_id") final String machine_name_or_id, @Param("username") final String username);

    @Query("SELECT count(pl.id) FROM ProcessLog pl WHERE LOWER(pl.machine_id.name) = LOWER(:machine_name_or_id) OR " + "LOWER" + "(pl.machine_id.id) = LOWER(:machine_name_or_id) AND pl.employee_id.user_id.username = :username")
    Long countProcessLogByMachineNameOrIdAndUsername(@Param("machine_name_or_id") final String machine_name_or_id, @Param("username") final String username);

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("UPDATE Machines m SET m.status = :status WHERE LOWER(m.name) = LOWER(:machine_name_or_id) OR LOWER(m.id) = LOWER(:machine_name_or_id)")
    Integer updateMachineStatus(@Param("machine_name_or_id") String machine_name_or_id, @Param("status") MachineStatus status);

    @Query("SELECT m FROM Machines m WHERE LOWER(m.name) LIKE LOWER(CONCAT('%',:machine_name,'%'))")
    List<Machines> findMachinesByName(@Param("machine_name") final String machine_name, Pageable pageable);

    @Query("SELECT m FROM Machines m WHERE 1 = 1 " + MachineAllFiltersDTO.QUERY)
    List<Machines> findAllByMachineAllFilters(Pageable pageable, @Param("type") final String type, @Param("name") final String name, @Param("status") final String status, @Param("last_maintenance") final LocalDate last_maintenance);

    @Query("SELECT COUNT(m.id) FROM Machines m WHERE 1 = 1" + MachineAllFiltersDTO.QUERY)
    Long countAllByMachineAllFilters(@Param("type") final String type, @Param("name") final String name, @Param("status") final String status, @Param("last_maintenance") final LocalDate last_maintenance);

    @Modifying
    @Transactional
    @Query("DELETE FROM Machines m WHERE m.id = :id")
    void deleteById(@Param("id") String id);
}
