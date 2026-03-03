package com.fu.a3nguyenphamhoangminh_se18d04.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
    //SPRING QUẢN LÝ FILTER
    @Autowired
    private JwtAuthFilter jwtAuthFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable()) // Tắt CSRF cho REST API
                .cors(cors -> cors.configure(http))
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/auth/**").permitAll() // Cho phép truy cập API đăng nhập, đăng ký
                        .requestMatchers("/error").permitAll()
                        .requestMatchers("/api/customers/me").hasRole("CUSTOMER") // Customer xem/cập nhật profile của mình
                        .requestMatchers("/api/customers/**").hasRole("STAFF") // Staff quản lý KH
                        .requestMatchers(HttpMethod.GET, "/api/rooms", "/api/rooms/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/rooms", "/api/rooms/**").hasRole("STAFF")
                        .requestMatchers(HttpMethod.PUT, "/api/rooms", "/api/rooms/**").hasRole("STAFF")
                        .requestMatchers(HttpMethod.DELETE, "/api/rooms", "/api/rooms/**").hasRole("STAFF")
                        .requestMatchers("/api/bookings/my-history").hasRole("CUSTOMER") // KH xem lịch sử của mình
                        .requestMatchers("/api/bookings", "/api/bookings/**").hasAnyRole("STAFF", "CUSTOMER") // Tuỳ API cụ thể bên trong sẽ check tiếp
                        .anyRequest().authenticated()
                );

        http.addFilterBefore(jwtAuthFilter, org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }
}