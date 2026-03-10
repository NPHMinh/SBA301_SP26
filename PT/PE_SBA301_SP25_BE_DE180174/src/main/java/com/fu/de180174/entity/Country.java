package com.fu.A3nguyenphamhoangminh_se18D04.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "Country")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Country {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "CountryID")
    private int countryID;

    @Column(name = "CountryName", length = 15)
    private String countryName;
}
