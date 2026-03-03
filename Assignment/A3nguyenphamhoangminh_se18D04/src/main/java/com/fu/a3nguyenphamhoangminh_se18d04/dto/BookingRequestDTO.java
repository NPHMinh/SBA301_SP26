package com.fu.a3nguyenphamhoangminh_se18d04.dto;

import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class BookingRequestDTO {
    private Integer customerID;
    private LocalDate bookingDate;
    private Byte bookingStatus;
    private List<RoomDetailDTO> bookingDetails;

    @Data
    public static class RoomDetailDTO {
        private Integer roomID;
        private LocalDate startDate;
        private LocalDate endDate;
    }
}
