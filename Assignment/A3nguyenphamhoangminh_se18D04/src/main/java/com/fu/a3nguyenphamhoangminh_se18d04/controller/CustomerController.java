package com.fu.a3nguyenphamhoangminh_se18d04.controller;

import com.fu.a3nguyenphamhoangminh_se18d04.entity.Customer;
import com.fu.a3nguyenphamhoangminh_se18d04.repository.CustomerRepository;
import com.fu.a3nguyenphamhoangminh_se18d04.service.CustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/customers")
@CrossOrigin(origins = "*") // Cho phép ReactJS (khác port) gọi API này
public class CustomerController {

    @Autowired
    private CustomerService customerService;

    @Autowired
    private CustomerRepository customerRepository;

    // GET /api/customers/me - Customer xem profile của chính mình
    // PHẢI đặt TRƯỚC /{id} để tránh "me" bị match như một Integer ID
    @GetMapping("/me")
    public ResponseEntity<?> getMyProfile() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Customer customer = customerRepository.findByEmailAddress(email);
        if (customer == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Customer not found.");
        }
        return ResponseEntity.ok(customer);
    }

    // PUT /api/customers/me - Customer tự cập nhật profile
    @PutMapping("/me")
    public ResponseEntity<?> updateMyProfile(@RequestBody Customer customerDetails) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Customer existing = customerRepository.findByEmailAddress(email);
        if (existing == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Customer not found.");
        }
        existing.setCustomerFullName(customerDetails.getCustomerFullName());
        existing.setTelephone(customerDetails.getTelephone());
        existing.setCustomerBirthday(customerDetails.getCustomerBirthday());
        if (customerDetails.getEmailAddress() != null && !customerDetails.getEmailAddress().isBlank()) {
            existing.setEmailAddress(customerDetails.getEmailAddress());
        }
        if (customerDetails.getPassword() != null && !customerDetails.getPassword().isBlank()) {
            existing.setPassword(new org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder()
                    .encode(customerDetails.getPassword()));
        }
        return ResponseEntity.ok(customerService.saveCustomer(existing));
    }

    // API lấy danh sách: GET /api/customers
    @GetMapping
    public ResponseEntity<List<Customer>> getAll() {
        return new ResponseEntity<>(customerService.getAllCustomers(), HttpStatus.OK);
    }

    // API lấy chi tiết 1 user: GET /api/customers/1
    @GetMapping("/{id}")
    public ResponseEntity<Customer> getById(@PathVariable Integer id) {
        Customer customer = customerService.getCustomerById(id);
        if (customer != null) {
            return new ResponseEntity<>(customer, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    // API thêm mới: POST /api/customers
    @PostMapping
    public ResponseEntity<Customer> create(@Valid @RequestBody Customer customer) {
        return new ResponseEntity<>(customerService.saveCustomer(customer), HttpStatus.CREATED);
    }

    // API cập nhật: PUT /api/customers/1
    @PutMapping("/{id}")
    public ResponseEntity<Customer> update(@PathVariable Integer id, @Valid @RequestBody Customer customerDetails) {
        Customer existingCustomer = customerService.getCustomerById(id);
        if (existingCustomer != null) {
            existingCustomer.setCustomerFullName(customerDetails.getCustomerFullName());
            existingCustomer.setTelephone(customerDetails.getTelephone());
            existingCustomer.setCustomerBirthday(customerDetails.getCustomerBirthday());
            if (customerDetails.getEmailAddress() != null && !customerDetails.getEmailAddress().isBlank()) {
                existingCustomer.setEmailAddress(customerDetails.getEmailAddress());
            }
            if (customerDetails.getPassword() != null && !customerDetails.getPassword().isBlank()) {
                existingCustomer.setPassword(new org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder()
                        .encode(customerDetails.getPassword()));
            }
            return new ResponseEntity<>(customerService.saveCustomer(existingCustomer), HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    // API xóa: DELETE /api/customers/1
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        customerService.deleteCustomer(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}