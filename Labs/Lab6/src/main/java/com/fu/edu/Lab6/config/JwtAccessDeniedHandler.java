package com.fu.edu.Lab6.config;

import com.fu.edu.Lab6.dto.ErrorResponse;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.MediaType;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.time.LocalDateTime;

// Xử lý trường hợp người dùng đã đăng nhập nhưng không có quyền (Role) truy cập
@Component
public class JwtAccessDeniedHandler implements AccessDeniedHandler {

    @Override
    public void handle(
            HttpServletRequest request,
            HttpServletResponse response,
            AccessDeniedException accessDeniedException
    ) throws IOException, ServletException {

        // Cấu hình Header cho phản hồi: Định dạng JSON và mã lỗi 403 (Forbidden)
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setStatus(HttpServletResponse.SC_FORBIDDEN);

        // Khởi tạo nội dung thông báo lỗi chi tiết
        ErrorResponse errorResponse = ErrorResponse.builder()
                .status(HttpServletResponse.SC_FORBIDDEN)
                .error("Forbidden")
                .message("Bạn không có quyền truy cập tài nguyên này!")
                .path(request.getRequestURI())
                .timestamp(LocalDateTime.now())
                .build();

        // Chuyển đổi đối tượng Java (errorResponse) sang JSON và ghi vào luồng phản hồi
        final ObjectMapper mapper = new ObjectMapper();
        mapper.findAndRegisterModules(); // Hỗ trợ định dạng kiểu dữ liệu thời gian (LocalDateTime)
        mapper.writeValue(response.getOutputStream(), errorResponse);
    }
}