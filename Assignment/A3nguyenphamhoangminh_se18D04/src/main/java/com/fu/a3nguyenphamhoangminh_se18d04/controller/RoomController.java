package com.fu.a3nguyenphamhoangminh_se18d04.controller;

import com.fu.a3nguyenphamhoangminh_se18d04.entity.RoomInformation;
import com.fu.a3nguyenphamhoangminh_se18d04.entity.RoomType;
import com.fu.a3nguyenphamhoangminh_se18d04.repository.RoomTypeRepository;
import com.fu.a3nguyenphamhoangminh_se18d04.service.RoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rooms")
@CrossOrigin("*")
public class RoomController {

    @Autowired
    private RoomService roomService;

    @Autowired
    private RoomTypeRepository roomTypeRepository;

    // Ai cũng xem được danh sách phòng
    @GetMapping
    public ResponseEntity<List<RoomInformation>> getAllRooms() {
        return ResponseEntity.ok(roomService.getAllRooms());
    }

    // Lấy danh sách loại phòng - PHẢI đặt TRƯỚC /{id} để tránh 405
    @GetMapping("/types")
    public ResponseEntity<List<RoomType>> getAllRoomTypes() {
        return ResponseEntity.ok(roomTypeRepository.findAll());
    }

    // Chỉ Staff mới gọi được API thêm phòng (Đã chặn ở SecurityConfig)
    @PostMapping
    public ResponseEntity<RoomInformation> createRoom(@RequestBody RoomInformation room) {
        return new ResponseEntity<>(roomService.saveRoom(room), HttpStatus.CREATED);
    }

    // Cập nhật thông tin phòng
    @PutMapping("/{id}")
    public ResponseEntity<RoomInformation> updateRoom(@PathVariable Integer id, @RequestBody RoomInformation roomDetails) {
        RoomInformation existing = roomService.getRoomById(id);
        if (existing == null) {
            return ResponseEntity.notFound().build();
        }
        existing.setRoomNumber(roomDetails.getRoomNumber());
        existing.setRoomDetailDescription(roomDetails.getRoomDetailDescription());
        existing.setRoomMaxCapacity(roomDetails.getRoomMaxCapacity());
        existing.setRoomStatus(roomDetails.getRoomStatus());
        existing.setRoomPricePerDay(roomDetails.getRoomPricePerDay());
        existing.setRoomType(roomDetails.getRoomType());
        return ResponseEntity.ok(roomService.saveRoom(existing));
    }

    // Gọi hàm xóa đặc biệt (xóa thật hoặc đổi status)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRoom(@PathVariable Integer id) {
        roomService.deleteRoom(id);
        return ResponseEntity.noContent().build();
    }
}