package com.fu.a3nguyenphamhoangminh_se18d04.service;

import com.fu.a3nguyenphamhoangminh_se18d04.entity.BookingDetail;
import com.fu.a3nguyenphamhoangminh_se18d04.entity.BookingDetailId;
import com.fu.a3nguyenphamhoangminh_se18d04.entity.BookingReservation;
import com.fu.a3nguyenphamhoangminh_se18d04.repository.BookingDetailRepository;
import com.fu.a3nguyenphamhoangminh_se18d04.repository.BookingReservationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class BookingService {

    @Autowired
    private BookingReservationRepository reservationRepository;

    @Autowired
    private BookingDetailRepository detailRepository;

    @Transactional
    public BookingReservation createBooking(BookingReservation reservation, List<BookingDetail> details) {
        // 1. Đặt ngày đặt phòng nếu chưa có
        if (reservation.getBookingDate() == null) {
            reservation.setBookingDate(LocalDate.now());
        }

        // 2. Lưu BookingReservation và flush ngay để lấy ID từ IDENTITY column
        BookingReservation saved = reservationRepository.saveAndFlush(reservation);

        // 3. Gán BookingDetailId (khóa chính kép) và liên kết với reservation vừa lưu
        for (BookingDetail detail : details) {
            BookingDetailId id = new BookingDetailId(
                saved.getBookingReservationID(),
                detail.getRoomInformation().getRoomID()
            );
            detail.setId(id);
            detail.setBookingReservation(saved);
        }

        // 4. Lưu tất cả BookingDetail
        detailRepository.saveAll(details);

        // 5. Trả về reservation đã được lưu (reload để có bookingDetails đầy đủ)
        return reservationRepository.findById(saved.getBookingReservationID()).orElseThrow();
    }

    public List<BookingReservation> getAllBookings() {
        return reservationRepository.findAll();
    }

    public BookingReservation getBookingById(Integer id) {
        return reservationRepository.findById(id).orElse(null);
    }

    public BookingReservation updateBookingStatus(Integer id, Byte status) {
        Optional<BookingReservation> opt = reservationRepository.findById(id);
        if (opt.isEmpty()) return null;
        BookingReservation reservation = opt.get();
        reservation.setBookingStatus(status);
        return reservationRepository.save(reservation);
    }

    public List<BookingReservation> getHistoryByCustomerId(Integer customerId) {
        return reservationRepository.findByCustomer_CustomerID(customerId);
    }
}