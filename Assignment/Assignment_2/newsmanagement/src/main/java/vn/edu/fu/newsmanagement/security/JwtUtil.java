package vn.edu.fu.newsmanagement.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Component
public class JwtUtil {
    
    // Secret key - NÊN lưu trong application.properties
    @Value("${jwt.secret:mySecretKeyForJWTTokenGenerationAndValidation12345678}")
    private String secret;
    
    // Thời gian hết hạn token (24 giờ)
    @Value("${jwt.expiration:86400000}")
    private Long expiration;
    
    // Tạo SecretKey từ string
    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(secret.getBytes());
    }
    
    // Generate JWT token
    public String generateToken(String email, Integer accountId, Integer accountRole) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("accountId", accountId);
        claims.put("accountRole", accountRole);
        claims.put("email", email);
        
        return Jwts.builder()
                .claims(claims)
                .subject(email)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(getSigningKey())
                .compact();
    }
    
    // Lấy email từ token
    public String getEmailFromToken(String token) {
        return getClaims(token).getSubject();
    }
    
    // Lấy accountId từ token
    public Integer getAccountIdFromToken(String token) {
        return getClaims(token).get("accountId", Integer.class);
    }
    
    // Lấy accountRole từ token
    public Integer getAccountRoleFromToken(String token) {
        return getClaims(token).get("accountRole", Integer.class);
    }
    
    // Lấy tất cả claims từ token
    private Claims getClaims(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
    
    // Validate token
    public boolean validateToken(String token) {
        try {
            Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }
    
    // Check token đã hết hạn chưa
    public boolean isTokenExpired(String token) {
        try {
            Date expiration = getClaims(token).getExpiration();
            return expiration.before(new Date());
        } catch (JwtException e) {
            return true;
        }
    }
}

