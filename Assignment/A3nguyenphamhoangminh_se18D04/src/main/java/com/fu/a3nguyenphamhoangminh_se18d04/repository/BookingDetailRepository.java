package com.fu.a3nguyenphamhoangminh_se18d04.repository;

import com.fu.a3nguyenphamhoangminh_se18d04.entity.BookingDetail;
import com.fu.a3nguyenphamhoangminh_se18d04.entity.BookingDetailId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BookingDetailRepository extends JpaRepository<BookingDetail, BookingDetailId> {
    // Kiểm tra xem phòng này đã từng được đặt chưa (phục vụ cho logic Xóa phòng)
    boolean existsByRoomInformation_RoomID(Integer roomId);
}