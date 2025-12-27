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

     // LOGIN
    public AuthResponse login(LoginRequest request) {
        // 1. Tìm user theo email
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        // 2. Kiểm tra mật khẩu nhập vào có trùng BCrypt hash trong DB không
        if(!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }

        // 3. Tạo access token & refresh token
        var accessToken = jwtService.generateToken(user.getEmail(), "access");
        var resfreshToken = jwtService.generateToken(user.getEmail(), "refresh");

        // 4. Trả về response bao gồm token & thông tin user
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

    // REFRESH TOKEN
    public AuthResponse refreshToken(RefreshRequest request) {
        // 1. Kiểm tra refresh token hợp lệ về mặt chữ ký
        if(!jwtService.validateToken(request.getRefreshToken())) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }
        // 2. Lấy toàn bộ claims trong token
        Claims claims = jwtService.extractAllClaims(request.getRefreshToken());

        // 3. Kiểm tra token có hết hạn không
        if(jwtService.isExpired(request.getRefreshToken())) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        // 4. Kiểm tra type của token: phải là "refresh"
        String type = (String) claims.get("type");
        if(!"refresh".equals(type)) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }
        String email = claims.getSubject();

        // 5. Kiểm tra user còn tồn tại không
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        // 7. Sinh access token mới (refresh token được tái sử dụng)
        String newAccessToken = jwtService.generateToken(email, "access");

        return AuthResponse.builder()
                .accessToken(newAccessToken)
                .refreshToken(request.getRefreshToken())
                .success(true)
                .build();
    }

    // LOGOUT
    public void logout(String token){
        if (token == null || token.isBlank()) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        // Lấy thời gian hết hạn của token
        var expiry = jwtService.extractAllClaims(token).getExpiration();

        // Tạo object InvalidToken để lưu token bị vô hiệu vào DB
        InvalidToken invalidToken = InvalidToken.builder()
                .token(token)
                .expiryTime(expiry.toInstant().atZone(ZoneId.systemDefault()).toLocalDateTime())
                .build();

        // Lưu token vào bảng invalid_tokens → đảm bảo không thể dùng lại
        invalidatedTokenRepository.save(invalidToken);
    }
}
