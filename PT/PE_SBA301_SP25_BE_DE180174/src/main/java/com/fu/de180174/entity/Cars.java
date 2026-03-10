package com.fu.A3nguyenphamhoangminh_se18D04.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "Cars")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Cars {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "CarID")
    private int carID;

    @Column(name = "CarName", length = 40)
    private String carName;

    @Column(name = "CountryID")
    private int countryID;

    @Column(name = "UnitsInStock")
    private short unitsInStock;

    @Column(name = "UnitPrice")
    private int unitPrice;

    @Column(name = "CreatedAt")
    private LocalDateTime createdAt;

    @Column(name = "UpdatedAt")
    private LocalDateTime updatedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "CountryID", insertable = false, updatable = false)
    private Country country;
}
