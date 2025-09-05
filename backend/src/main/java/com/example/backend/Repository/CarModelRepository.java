package com.example.backend.Repository;

import com.example.backend.Model.Class.CarModel;
import com.example.backend.Model.Dto.CarModelFilterDTO;
import org.hibernate.annotations.Parameter;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CarModelRepository extends JpaRepository<CarModel, String> {
    @Query("SELECT c FROM CarModel c WHERE LOWER(c.name) LIKE LOWER(CONCAT('%', :name, '%')) ")
    List<CarModel> findByName(@Param("name") final String name, Pageable pageable);

    @Query("SELECT cm FROM CarModel cm")
    List<CarModel> findAllCarModels();

    @Query("SELECT cm FROM CarModel cm" + CarModelFilterDTO.QUERY)
    List<CarModel> findCarModelByCarModelFilter(Pageable pageable, @Param("name") final String name, @Param("generation") final Long generation, @Param("release_year") final Long release_year);

    @Query("SELECT COUNT(cm.ID) FROM CarModel cm" + CarModelFilterDTO.QUERY)
    Long countCarModelByCarModelFilter(@Param("name") final String name, @Param("generation") final Long generation, @Param("release_year") final Long release_year);
}
