package com.fu.a3nguyenphamhoangminh_se18d04.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RoomInformation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "roomid")
    private Integer roomID;

    private String roomNumber;
    private String roomDetailDescription;
    private Integer roomMaxCapacity;
    private Byte roomStatus;
    private BigDecimal roomPricePerDay;

    @ManyToOne
    @JoinColumn(name = "room_typeid")
    private RoomType roomType;
}
