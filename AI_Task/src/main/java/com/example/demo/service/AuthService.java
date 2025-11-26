package com.example.demo.service;

import com.example.demo.dto.request.LoginRequest;
import com.example.demo.dto.request.RefreshRequest;
import com.example.demo.dto.response.AuthResponse;
import com.example.demo.dto.response.UserResponse;
import com.example.demo.entity.InvalidToken;
import com.example.demo.entity.User;
import com.example.demo.exception.AppException;
import com.example.demo.exception.ErrorCode;
import com.example.demo.repository.InvalidatedTokenRepository;
import com.example.demo.repository.UserRepository;
import io.jsonwebtoken.Claims;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.ZoneId;


@Service
@RequiredArgsConstructor
public class AuthService {

     private final UserRepository userRepository;
     private final JwtService jwtService;
     private final BCryptPasswordEncoder passwordEncoder;
     private final InvalidatedTokenRepository invalidatedTokenRepository;

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        if(!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }

        var accessToken = jwtService.generateToken(user.getEmail(), "access");
        var resfreshToken = jwtService.generateToken(user.getEmail(), "refresh");

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(resfreshToken)
                .user(UserResponse.builder()
                        .id(user.getId())
                        .email(user.getEmail())
                        .build())
                .success(true)
                .build();
    }


    public AuthResponse refreshToken(RefreshRequest request) {
        if(!jwtService.validateToken(request.getRefreshToken())) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }
        Claims claims = jwtService.extractAllClaims(request.getRefreshToken());
        if(jwtService.isExpired(request.getRefreshToken())) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        String type = (String) claims.get("type");
        if(!"refresh".equals(type)) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }
        String email = claims.getSubject();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        String newAccessToken = jwtService.generateToken(email, "access");

        return AuthResponse.builder()
                .accessToken(newAccessToken)
                .refreshToken(request.getRefreshToken())
                .success(true)
                .build();
    }
    public void logout(String token){
        if (token == null || token.isBlank()) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        var expiry = jwtService.extractAllClaims(token).getExpiration();

        InvalidToken invalidToken = InvalidToken.builder()
                .token(token)
                .expiryTime(expiry.toInstant().atZone(ZoneId.systemDefault()).toLocalDateTime())
                .build();

        invalidatedTokenRepository.save(invalidToken);
    }
}
