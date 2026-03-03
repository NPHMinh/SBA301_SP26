package com.fu.a3nguyenphamhoangminh_se18d04.service;

import com.fu.a3nguyenphamhoangminh_se18d04.entity.RoomInformation;
import com.fu.a3nguyenphamhoangminh_se18d04.repository.BookingDetailRepository;
import com.fu.a3nguyenphamhoangminh_se18d04.repository.RoomInformationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RoomService {

    @Autowired
    private RoomInformationRepository roomRepository;

    @Autowired
    private BookingDetailRepository bookingDetailRepository;

    public List<RoomInformation> getAllRooms() {
        return roomRepository.findAll();
    }

    public RoomInformation getRoomById(Integer id) {
        return roomRepository.findById(id).orElse(null);
    }

    public RoomInformation saveRoom(RoomInformation room) {
        return roomRepository.save(room);
    }

    // Logic xóa đặc biệt theo yêu cầu của đề bài
    public void deleteRoom(Integer roomId) {
        // Kiểm tra xem phòng này đã có trong chi tiết đặt phòng (BookingDetail) chưa
        // Tạo hàm existsByRoomInformation_RoomID trong BookingDetailRepository
        boolean isRoomBooked = bookingDetailRepository.existsByRoomInformation_RoomID(roomId);

        if (isRoomBooked) {
            // Nếu đã có người thuê trong quá khứ -> Không xóa, chỉ đổi trạng thái (status = 0)
            RoomInformation room = roomRepository.findById(roomId).orElseThrow();
            room.setRoomStatus((byte) 0); // 0: Inactive / Deleted logically
            roomRepository.save(room);
        } else {
            // Nếu chưa ai thuê bao giờ -> Xóa hẳn khỏi DB
            roomRepository.deleteById(roomId);
        }
    }
}