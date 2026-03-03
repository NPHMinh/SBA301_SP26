package vn.edu.fu.newsmanagement.dto;

import lombok.Data;

@Data
public class LoginResponse {
    private String token;
    private Integer accountId;
    private String accountName;
    private String accountEmail;
    private Integer accountRole;
}
