package vn.edu.fu.newsmanagement.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.edu.fu.newsmanagement.pojos.SystemAccount;
import vn.edu.fu.newsmanagement.services.SystemAccountService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/accounts")
@CrossOrigin(origins = "http://localhost:5173")
public class SystemAccountController {

    @Autowired
    private SystemAccountService accountService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginData) {
        String email = loginData.get("email");
        String password = loginData.get("password");
        SystemAccount user = accountService.authenticate(email, password);
        if (user != null) return ResponseEntity.ok(user);
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid email or password");
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