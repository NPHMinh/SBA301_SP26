package com.fu.a3nguyenphamhoangminh_se18d04.repository;

import com.fu.a3nguyenphamhoangminh_se18d04.entity.BookingReservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface BookingReservationRepository extends JpaRepository<BookingReservation, Integer> {
    // Tìm danh sách lịch sử đặt phòng của 1 khách hàng cụ thể
    List<BookingReservation> findByCustomer_CustomerID(Integer customerId);
}