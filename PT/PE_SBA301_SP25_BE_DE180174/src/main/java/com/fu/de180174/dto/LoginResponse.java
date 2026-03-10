package com.fu.A3nguyenphamhoangminh_se18D04.dto;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LoginResponse {
    private String token;
    private String memberID;
    private int memberRole;
}
