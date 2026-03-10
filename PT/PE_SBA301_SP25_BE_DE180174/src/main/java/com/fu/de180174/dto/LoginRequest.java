package com.fu.A3nguyenphamhoangminh_se18D04.dto;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LoginRequest {
    private String memberID;
    private String memberPassword;
}
