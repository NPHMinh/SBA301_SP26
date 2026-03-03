package com.fu.a3nguyenphamhoangminh_se18d04.security;

import com.fu.a3nguyenphamhoangminh_se18d04.entity.Customer;
import com.fu.a3nguyenphamhoangminh_se18d04.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Value("${staff.account.email}")
    private String adminEmail;

    @Value("${staff.account.password}")
    private String adminPassword;

    @Autowired
    private CustomerRepository customerRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        // 1. Kiểm tra nếu là Staff (từ application.properties)
        if (email.equals(adminEmail)) {
            return User.builder()
                    .username(adminEmail)
                    .password("{noop}" + adminPassword) // {noop} để Spring hiểu là pass không mã hóa BCrypt
                    .roles("STAFF")
                    .build();
        }

        // 2. Nếu không phải Staff, tìm trong Database Customer
        Customer customer = customerRepository.findByEmailAddress(email);
        if (customer != null) {
            return User.builder()
                    .username(customer.getEmailAddress())
                    .password(customer.getPassword()) // Lưu ý: Mật khẩu trong DB nên được mã hóa BCrypt
                    .roles("CUSTOMER")
                    .build();
        }

        throw new UsernameNotFoundException("Không tìm thấy tài khoản với email: " + email);
    }
}