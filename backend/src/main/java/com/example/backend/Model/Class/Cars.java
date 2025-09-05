package com.example.backend.Model.Class;

import com.example.backend.Model.Enum.CarsStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Cacheable
@Setter
@Data
@Entity
@Table(name = "CARS")
public class Cars {
    @Id
    private String id;
    @Column(name = "vin", unique = true)
    private String vin;
    @Column(name = "assembly_date")
    private LocalDateTime assembly_date;
    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private CarsStatus status;
    @ManyToOne
    @JoinColumn(name = "model_id", referencedColumnName = "id")
    private CarModel model_id;
    public static final String QUERY = " FROM Cars c LEFT JOIN CarParts cp ON c.id = cp.car_id.id WHERE 1 = 1 "
            + "AND cp.installed_by.user_id.username = COALESCE(:username, cp.installed_by.user_id.username)";
}
