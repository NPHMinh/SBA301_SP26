package vn.edu.fu.newsmanagement.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import vn.edu.fu.newsmanagement.dto.LoginRequest;
import vn.edu.fu.newsmanagement.dto.LoginResponse;
import vn.edu.fu.newsmanagement.pojos.SystemAccount;
import vn.edu.fu.newsmanagement.security.JwtUtil;
import vn.edu.fu.newsmanagement.services.SystemAccountService;

import java.util.List;

@RestController
@RequestMapping("/api/accounts")
@CrossOrigin(origins = "http://localhost:5173")
public class SystemAccountController {

    @Autowired
    private SystemAccountService accountService;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            // Tìm account theo email
            SystemAccount account = accountService.findByEmail(loginRequest.getEmail());

            if (account == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("Invalid email or password");
            }

            // Verify password
            if (!passwordEncoder.matches(loginRequest.getPassword(), account.getAccountPassword())) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("Invalid email or password");
            }

            // Generate JWT token
            String token = jwtUtil.generateToken(
                    account.getAccountEmail(),
                    account.getAccountId(),
                    account.getAccountRole());

            // Tạo response object
            LoginResponse response = new LoginResponse();
            response.setToken(token);
            response.setAccountId(account.getAccountId());
            response.setAccountName(account.getAccountName());
            response.setAccountEmail(account.getAccountEmail());
            response.setAccountRole(account.getAccountRole());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Login failed: " + e.getMessage());
        }
    }

    @GetMapping
    public List<SystemAccount> getAllAccounts() {
        return accountService.getAllAccounts();
    }

    @PostMapping
    public SystemAccount createAccount(@RequestBody SystemAccount account) {
        return accountService.createAccount(account);
    }

    // --- THÊM API GET BY ID (Sửa lỗi 404) ---
    @GetMapping("/{id}")
    public ResponseEntity<SystemAccount> getAccountById(@PathVariable Integer id) {
        SystemAccount account = accountService.getAccountById(id);
        if (account != null) {
            return ResponseEntity.ok(account);
        }
        return ResponseEntity.notFound().build();
    }

    // --- THÊM API UPDATE (Cho trang Profile) ---
    @PutMapping("/{id}")
    public ResponseEntity<SystemAccount> updateAccount(@PathVariable Integer id, @RequestBody SystemAccount account) {
        SystemAccount updated = accountService.updateAccount(id, account);
        if (updated != null) {
            return ResponseEntity.ok(updated);
        }
        return ResponseEntity.notFound().build();
    }

}