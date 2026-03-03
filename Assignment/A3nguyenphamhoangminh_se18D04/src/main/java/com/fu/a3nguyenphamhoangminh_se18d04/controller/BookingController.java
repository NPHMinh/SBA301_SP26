package com.fu.a3nguyenphamhoangminh_se18d04.controller;

import com.fu.a3nguyenphamhoangminh_se18d04.dto.BookingRequestDTO;
import com.fu.a3nguyenphamhoangminh_se18d04.entity.*;
import com.fu.a3nguyenphamhoangminh_se18d04.repository.CustomerRepository;
import com.fu.a3nguyenphamhoangminh_se18d04.repository.RoomInformationRepository;
import com.fu.a3nguyenphamhoangminh_se18d04.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin("*")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private RoomInformationRepository roomRepository;

    // GET /api/bookings - Staff xem tất cả
    @GetMapping
    public ResponseEntity<List<BookingReservation>> getAllBookings() {
        return ResponseEntity.ok(bookingService.getAllBookings());
    }

    // GET /api/bookings/my-history - Customer xem lịch sử của mình
    @GetMapping("/my-history")
    public ResponseEntity<?> getMyHistory() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Customer customer = customerRepository.findByEmailAddress(email);
        if (customer == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Customer not found.");
        }
        return ResponseEntity.ok(bookingService.getHistoryByCustomerId(customer.getCustomerID()));
    }

    // GET /api/bookings/{id}
    @GetMapping("/{id}")
    public ResponseEntity<?> getBookingById(@PathVariable Integer id) {
        BookingReservation booking = bookingService.getBookingById(id);
        if (booking == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(booking);
    }

    // POST /api/bookings - Tạo booking mới
    @PostMapping
    public ResponseEntity<?> createBooking(@RequestBody BookingRequestDTO dto) {
        Customer customer = customerRepository.findById(dto.getCustomerID()).orElse(null);
        if (customer == null) {
            return ResponseEntity.badRequest().body("Customer not found.");
        }

        BookingReservation reservation = new BookingReservation();
        reservation.setCustomer(customer);
        reservation.setBookingDate(dto.getBookingDate() != null ? dto.getBookingDate() : LocalDate.now());
        reservation.setBookingStatus(dto.getBookingStatus() != null ? dto.getBookingStatus() : (byte) 1);

        List<BookingDetail> details = new ArrayList<>();
        BigDecimal totalPrice = BigDecimal.ZERO;

        for (BookingRequestDTO.RoomDetailDTO roomDto : dto.getBookingDetails()) {
            RoomInformation room = roomRepository.findById(roomDto.getRoomID()).orElse(null);
            if (room == null) {
                return ResponseEntity.badRequest().body("Room ID " + roomDto.getRoomID() + " not found.");
            }

            long days = ChronoUnit.DAYS.between(roomDto.getStartDate(), roomDto.getEndDate());
            if (days <= 0) {
                return ResponseEntity.badRequest().body("End date must be after start date for room " + room.getRoomNumber());
            }
            BigDecimal actualPrice = room.getRoomPricePerDay().multiply(BigDecimal.valueOf(days));
            totalPrice = totalPrice.add(actualPrice);

            BookingDetail detail = new BookingDetail();
            detail.setRoomInformation(room);
            detail.setStartDate(roomDto.getStartDate());
            detail.setEndDate(roomDto.getEndDate());
            detail.setActualPrice(actualPrice);
            details.add(detail);
        }

        reservation.setTotalPrice(totalPrice);
        BookingReservation saved = bookingService.createBooking(reservation, details);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    // PUT /api/bookings/{id}/status - Cập nhật trạng thái
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Integer id, @RequestBody Map<String, Object> body) {
        Object statusVal = body.get("bookingStatus");
        if (statusVal == null) {
            return ResponseEntity.badRequest().body("bookingStatus is required.");
        }
        Byte status = ((Number) statusVal).byteValue();
        BookingReservation updated = bookingService.updateBookingStatus(id, status);
        if (updated == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(updated);
    }
}
