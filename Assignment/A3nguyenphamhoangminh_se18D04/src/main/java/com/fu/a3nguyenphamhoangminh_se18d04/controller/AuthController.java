package com.fu.a3nguyenphamhoangminh_se18d04.controller;

import com.fu.a3nguyenphamhoangminh_se18d04.entity.Customer;
import com.fu.a3nguyenphamhoangminh_se18d04.repository.CustomerRepository;
import com.fu.a3nguyenphamhoangminh_se18d04.security.CustomUserDetailsService;
import com.fu.a3nguyenphamhoangminh_se18d04.security.JwtUtils;
import com.fu.a3nguyenphamhoangminh_se18d04.service.CustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin("*")
public class AuthController {

    @Autowired
    private CustomUserDetailsService userDetailsService;

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private CustomerService customerService;

    @Autowired
    private CustomerRepository customerRepository;

    // API Đăng nhập
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginRequest) {
        String email = loginRequest.get("email");
        String password = loginRequest.get("password");

        // Load user lên
        UserDetails userDetails = userDetailsService.loadUserByUsername(email);

        // Giả lập check password (trong thực tế dùng AuthenticationManager)
        boolean isPasswordMatch = false;
        if (userDetails.getPassword().startsWith("{noop}")) {
            isPasswordMatch = password.equals(userDetails.getPassword().replace("{noop}", ""));
        } else {
            // Dùng BCrypt cho Customer DB
            isPasswordMatch = new BCryptPasswordEncoder().matches(password, userDetails.getPassword());
        }

        if (isPasswordMatch) {
            String token = jwtUtils.generateToken(userDetails);
            String role = userDetails.getAuthorities().iterator().next().getAuthority();

            // Nếu là Customer thì trả thêm customerId để Frontend lưu vào context
            Customer customer = customerRepository.findByEmailAddress(email);
            if (customer != null) {
                return ResponseEntity.ok(Map.of(
                        "token", token,
                        "role", role,
                        "customerId", customer.getCustomerID()
                ));
            }
            // Staff không có customerId trong DB
            return ResponseEntity.ok(Map.of(
                    "token", token,
                    "role", role
            ));
        } else {
            return ResponseEntity.status(401).body("Sai mật khẩu");
        }
    }

    // API Đăng ký tài khoản mới
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Customer registerRequest) {
        // Kiểm tra email đã tồn tại chưa
        if (customerRepository.findByEmailAddress(registerRequest.getEmailAddress()) != null) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Email already in use.");
        }

        // Hash mật khẩu trước khi lưu
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        registerRequest.setPassword(encoder.encode(registerRequest.getPassword()));

        // Mặc định status = 1 (active) nếu chưa được set
        if (registerRequest.getCustomerStatus() == null) {
            registerRequest.setCustomerStatus((byte) 1);
        }

        Customer saved = customerService.saveCustomer(registerRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }
}