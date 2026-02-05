package com.fu.edu.Lab6.config;

import com.fu.edu.Lab6.dto.ErrorResponse;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.MediaType;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.time.LocalDateTime;

// Xử lý khi người dùng truy cập tài nguyên yêu cầu xác thực nhưng chưa đăng nhập
@Component
public class JwtAuthenticationEntryPoint implements AuthenticationEntryPoint {

    @Override
    public void commence(
            HttpServletRequest request,
            HttpServletResponse response,
            AuthenticationException authException
    ) throws IOException, ServletException {

        // Thiết lập phản hồi trả về định dạng JSON và mã lỗi 401 (Unauthorized)
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);

        // Tạo nội dung lỗi chi tiết gửi về cho Client
        ErrorResponse errorResponse = ErrorResponse.builder()
                .status(HttpServletResponse.SC_UNAUTHORIZED)
                .error("Unauthorized")
                .message("Bạn cần đăng nhập để truy cập tài nguyên này!")
                .path(request.getRequestURI())
                .timestamp(LocalDateTime.now())
                .build();

        // Chuyển đối tượng Java sang JSON để ghi vào Body của Response
        final ObjectMapper mapper = new ObjectMapper();
        mapper.findAndRegisterModules(); // Đăng ký module để xử lý đúng định dạng LocalDateTime
        mapper.writeValue(response.getOutputStream(), errorResponse);
    }
}