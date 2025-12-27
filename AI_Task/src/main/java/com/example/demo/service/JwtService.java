package com.example.demo.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class JwtService {
    @Value("${jwt.secret-key}")
    private String SECRET_KEY;

    @Value("${jwt.access-expiration-time}")
    private long ACCESS_EXPIRATION_TIME;     // Thời gian sống của Access Token

    @Value("${jwt.refresh-expiration-time}")
    private long REFRESH_EXPIRATION_TIME ;  // Thời gian sống của Refresh Token

    private Key getsignKey() {
        // SECRET_KEY được convert sang dạng byte để ký HMAC-SHA256
        return Keys.hmacShaKeyFor(SECRET_KEY.getBytes());
    }

    public String generateToken(String email, String type) {
        // Chọn thời gian hết hạn dựa theo token type
        long expiration = "refresh".equals(type) ? REFRESH_EXPIRATION_TIME  : ACCESS_EXPIRATION_TIME;

        // Build JWT
        return Jwts.builder()
                .setSubject(email)
                .setIssuedAt(new Date())
                .setId(UUID.randomUUID().toString())
                .setExpiration(new Date(System.currentTimeMillis() + expiration))
                .claim("type", type)
                .signWith(getsignKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    // LẤY EMAIL TỪ TOKEN
    public String extractEmail(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getsignKey())
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    // TRẢ VỀ TOÀN BỘ CLAIMS
    public Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getsignKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    // KIỂM TRA TOKEN HỢP LỆ (SIGNATURE + FORMAT)
    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder()
                    .setSigningKey(getsignKey())
                    .build()
                    .parseClaimsJws(token);
            return true;
        } catch (JwtException e) {
            System.out.println("❌ Token validation error: " + e.getMessage());
            return false;
        }
    }

    // KIỂM TRA TOKEN HẾT HẠN CHƯA
    public boolean isExpired(String token) {
        return extractAllClaims(token).getExpiration().before(new Date()); // expiration < time now → hết hạn
    }

    public String extractTokenType(String token) {
        return (String) extractAllClaims(token).get("type");
    }

    public record TokenPair(String accessToken, String refreshToken) {}
}
