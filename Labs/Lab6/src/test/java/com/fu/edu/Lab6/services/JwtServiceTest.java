package com.fu.edu.Lab6.services;

import com.fu.edu.Lab6.entity.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import javax.crypto.SecretKey;
import java.util.Date;

import static org.assertj.core.api.Assertions.assertThat;

@ExtendWith(MockitoExtension.class)
class JwtServiceTest {

    @InjectMocks
    private JwtService jwtService;

    private User testUser;
    private String secretKey = "404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970";
    private long jwtExpiration = 86400000; // 24 hours

    @BeforeEach
    void setUp() {
        // Set private fields using ReflectionTestUtils
        ReflectionTestUtils.setField(jwtService, "secretKey", secretKey);
        ReflectionTestUtils.setField(jwtService, "jwtExpiration", jwtExpiration);

        testUser = User.builder()
                .id(1L)
                .fullName("Test User")
                .email("test@example.com")
                .password("password123")
                .role("USER")
                .build();
    }

    @Test
    @DisplayName("Should generate valid JWT token")
    void shouldGenerateValidToken() {
        // When
        String token = jwtService.generateToken(testUser);

        // Then
        assertThat(token).isNotNull();
        assertThat(token).isNotEmpty();
        assertThat(token.split("\\.")).hasSize(3); // JWT has 3 parts
    }

    @Test
    @DisplayName("Should extract username from token")
    void shouldExtractUsernameFromToken() {
        // Given
        String token = jwtService.generateToken(testUser);

        // When
        String extractedUsername = jwtService.extractUsername(token);

        // Then
        assertThat(extractedUsername).isEqualTo(testUser.getEmail());
    }

    @Test
    @DisplayName("Should validate token successfully")
    void shouldValidateTokenSuccessfully() {
        // Given
        String token = jwtService.generateToken(testUser);

        // When
        boolean isValid = jwtService.isTokenValid(token, testUser);

        // Then
        assertThat(isValid).isTrue();
    }

    @Test
    @DisplayName("Should invalidate token with wrong user")
    void shouldInvalidateTokenWithWrongUser() {
        // Given
        String token = jwtService.generateToken(testUser);

        User wrongUser = User.builder()
                .email("wrong@example.com")
                .build();

        // When
        boolean isValid = jwtService.isTokenValid(token, wrongUser);

        // Then
        assertThat(isValid).isFalse();
    }

    @Test
    @DisplayName("Should extract expiration date from token")
    void shouldExtractExpirationDate() {
        // Given
        String token = jwtService.generateToken(testUser);

        // When
        Date expiration = jwtService.extractClaim(token, Claims::getExpiration);

        // Then
        assertThat(expiration).isNotNull();
        assertThat(expiration).isAfter(new Date());
    }

    @Test
    @DisplayName("Token should contain correct subject")
    void tokenShouldContainCorrectSubject() {
        // Given
        String token = jwtService.generateToken(testUser);

        // When
        SecretKey key = Keys.hmacShaKeyFor(Decoders.BASE64.decode(secretKey));
        Claims claims = Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload();

        // Then
        assertThat(claims.getSubject()).isEqualTo(testUser.getEmail());
    }

    @Test
    @DisplayName("Should extract all claims from token")
    void shouldExtractAllClaimsFromToken() {
        // Given
        String token = jwtService.generateToken(testUser);

        // When
        String subject = jwtService.extractClaim(token, Claims::getSubject);
        Date issuedAt = jwtService.extractClaim(token, Claims::getIssuedAt);
        Date expiration = jwtService.extractClaim(token, Claims::getExpiration);

        // Then
        assertThat(subject).isEqualTo(testUser.getEmail());
        assertThat(issuedAt).isNotNull();
        assertThat(expiration).isNotNull();
        assertThat(expiration).isAfter(issuedAt);
    }

    @Test
    @DisplayName("Token should not be expired immediately after creation")
    void tokenShouldNotBeExpiredImmediately() {
        // Given
        String token = jwtService.generateToken(testUser);

        // When
        boolean isValid = jwtService.isTokenValid(token, testUser);

        // Then
        assertThat(isValid).isTrue();
    }
}