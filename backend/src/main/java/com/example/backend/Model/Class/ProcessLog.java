package com.example.backend.Model.Class;

import com.example.backend.Model.Enum.ProcessLogStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Data
@Entity
@Cacheable
@Table(name = "PROCESS_LOG")
public class ProcessLog {
    @Id
    private String id;
    @Column(name = "start_time")
    private LocalDateTime start_time;
    @Column(name = "end_time")
    private LocalDateTime end_time;
    @Column(name = "status")
    @Enumerated(EnumType.STRING)
    private ProcessLogStatus status;
    @ManyToOne
    @JoinColumn(name = "process_id", referencedColumnName = "id")
    private Process process_id;
    @ManyToOne
    @JoinColumn(name ="employee_id", referencedColumnName = "id")
    private Employees employee_id;
    @ManyToOne
    @JoinColumn(name = "car_id", referencedColumnName = "id")
    private Cars car_id;
    @ManyToOne
    @JoinColumn(name = "machine_id", referencedColumnName = "id")
    private Machines machine_id;

    public static final String QUERY_BY_USERNAME_OR_PROCESS_NAME = " FROM ProcessLog p WHERE (:username IS NULL OR p.employee_id.user_id.username = :username) " +
            "AND (:process_log_id IS  NULL OR p.process_id.name = (SELECT pl2.process_id.name FROM ProcessLog pl2 WHERE :process_log_id = pl2.id )) ";
    public static final String QUERY_MACHINE_USED_FILTERS = " FROM ProcessLog pl LEFT JOIN Employees e ON pl" +
            ".employee_id.id = e.id LEFT JOIN User u ON e.id = u.employees_id.id WHERE pl.machine_id.id IN ( SELECT " + "DISTINCT pl_sub.machine_id.id FROM ProcessLog pl_sub " +
            "LEFT JOIN Employees e_sub ON pl_sub.employee_id.id " + "= e_sub.id " + "LEFT JOIN User u_sub ON " + "e_sub.id = u_sub.employees_id.id WHERE u_sub.username = "
            + ":username) AND u.username != :username";
    public static final String QUERY_MACHINE = " FROM ProcessLog p WHERE (LOWER(p.machine_id.name) = LOWER(:machine_name_or_id) OR LOWER(p.machine_id.id) = LOWER(:machine_name_or_id)) ";
}
