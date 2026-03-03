package com.fu.a3nguyenphamhoangminh_se18d04.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

// Class khóa chính kép
@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookingDetailId implements Serializable {
    @Column(name = "booking_reservationid")
    private Integer bookingReservationID;

    @Column(name = "roomid")
    private Integer roomID;
}
