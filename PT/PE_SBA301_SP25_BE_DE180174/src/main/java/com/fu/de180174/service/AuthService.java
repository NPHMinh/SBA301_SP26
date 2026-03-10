package com.fu.de180174.service;

import com.fu.de180174.dto.LoginRequest;
import com.fu.de180174.dto.LoginResponse;
import com.fu.de180174.repository.AccountMemberRepository;
import com.fu.de180174.security.JwtUtil;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    private final AccountMemberRepository repo;
    private final JwtUtil jwtUtil;

    public AuthService(AccountMemberRepository repo, JwtUtil jwtUtil) {
        this.repo = repo;
        this.jwtUtil = jwtUtil;
    }

    public LoginResponse login(LoginRequest request) {
        return repo.findByMemberIDAndMemberPassword(request.getMemberID(), request.getMemberPassword())
                .map(m -> new LoginResponse(
                        jwtUtil.generateToken(m.getMemberID(), m.getMemberRole()),
                        m.getMemberID(),
                        m.getMemberRole()))
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));
    }
}
