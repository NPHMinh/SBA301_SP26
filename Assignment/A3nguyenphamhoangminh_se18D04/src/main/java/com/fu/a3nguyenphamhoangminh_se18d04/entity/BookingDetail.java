package com.fu.a3nguyenphamhoangminh_se18d04.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString(exclude = {"bookingReservation"})          // tránh StackOverflow vòng lặp
@EqualsAndHashCode(exclude = {"bookingReservation"})  // tránh StackOverflow vòng lặp
public class BookingDetail {

    @EmbeddedId
    private BookingDetailId id;

    // insertable=false, updatable=false vì cột được quản lý bởi @EmbeddedId
    @ManyToOne
    @JoinColumn(name = "booking_reservationid", insertable = false, updatable = false)
    @JsonBackReference
    private BookingReservation bookingReservation;

    // insertable=false, updatable=false vì cột được quản lý bởi @EmbeddedId
    @ManyToOne
    @JoinColumn(name = "roomid", insertable = false, updatable = false)
    private RoomInformation roomInformation;

    private LocalDate startDate;
    private LocalDate endDate;
    private BigDecimal actualPrice;
}