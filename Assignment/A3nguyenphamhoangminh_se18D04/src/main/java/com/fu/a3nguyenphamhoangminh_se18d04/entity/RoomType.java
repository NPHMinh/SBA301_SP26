package com.fu.a3nguyenphamhoangminh_se18d04.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RoomType {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "room_typeid")
    private Integer roomTypeID;

    private String roomTypeName;
    private String typeDescription;
    private String typeNote;
}
