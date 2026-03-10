package com.fu.A3nguyenphamhoangminh_se18D04.dto;

import lombok.*;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CarDTO {
    private int carID;
    private String carName;
    private int countryID;
    private String countryName;
    private short unitsInStock;
    private int unitPrice;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
