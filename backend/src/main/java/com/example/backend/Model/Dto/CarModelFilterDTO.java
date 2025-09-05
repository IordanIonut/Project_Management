package com.example.backend.Model.Dto;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.stereotype.Component;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Component("carModelCacheKeyHelper")
public class CarModelFilterDTO {
    public static final String QUERY = " WHERE 1 = 1  AND (:name IS NULL OR LOWER(cm.name) LIKE LOWER(CONCAT('%',:name,'%'))) AND (:generation IS NULL OR cm.generation = :generation) AND (:release_year IS NULL OR cm.release_year = :release_year)";
    private String name;
    private Long generation;
    private Long release_year;

    public String buildCarModelKey(CarModelFilterDTO filters) {
        return +'_' + safe(filters.getName()) + "_" + safe(filters.getGeneration()) + "_" + safe(filters.getRelease_year());
    }

    private String safe(Object o) {
        return o == null ? "" : o.toString();
    }
}