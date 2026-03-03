package com.fu.a3nguyenphamhoangminh_se18d04.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Customer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "customerid")
    private Integer customerID;

    private String customerFullName;
    private String telephone;

    @Column(unique = true)
    private String emailAddress;

    private LocalDate customerBirthday;
    private Byte customerStatus;
    private String password;
}
