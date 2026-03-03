package com.fu.a3nguyenphamhoangminh_se18d04.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString(exclude = {"bookingDetails"})          // tránh StackOverflow vòng lặp
@EqualsAndHashCode(exclude = {"bookingDetails"})  // tránh StackOverflow vòng lặp
public class BookingReservation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "booking_reservationid")
    private Integer bookingReservationID;

    private LocalDate bookingDate;
    private BigDecimal totalPrice;
    private Byte bookingStatus;

    @ManyToOne
    @JoinColumn(name = "customerid")
    private Customer customer;

    @OneToMany(mappedBy = "bookingReservation", fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    @JsonManagedReference
    private List<BookingDetail> bookingDetails;
}
