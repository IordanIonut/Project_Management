package com.example.backend.Model.Dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@AllArgsConstructor
@Getter
@Setter
@NoArgsConstructor
@Component("machineAllCacheKeyHelper")
public class MachineAllFiltersDTO {
    public static final String QUERY = " AND (:type IS NULL OR LOWER(m.type) LIKE LOWER(CONCAT('%',:type,'%'))) AND" +
            " (:name IS NULL OR LOWER(m.name) LIKE LOWER(CONCAT('%',:name,'%%'))) AND " +
            " (:status IS NULL OR LOWER(m.status) LIKE LOWER(CONCAT('%',:status,'%'))) AND " +
            " (:last_maintenance IS NULL OR DATE(m.last_maintenance) = :last_maintenance)";
    private String type;
    private String name;
    private String status;
    private LocalDate last_maintenance;

    public String buildMachineAllKey(MachineAllFiltersDTO filters) {
        return +'_' + safe(filters.getType()) + "_" + safe(filters.getName()) + "_" + safe(filters.getStatus()) + "_" + safe(filters.getLast_maintenance());
    }

    private String safe(Object o) {
        return o == null ? "" : o.toString();
    }
}
