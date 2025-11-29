package com.example.demo.controller;

import com.example.demo.dto.request.LoginRequest;
import com.example.demo.dto.request.RefreshRequest;
import com.example.demo.dto.request.RegisterRequest;
import com.example.demo.dto.response.ApiResponse;
import com.example.demo.dto.response.AuthResponse;
import com.example.demo.dto.response.RegisterResponse;
import com.example.demo.service.AuthService;
import com.example.demo.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth") // Tất cả URL đều bắt đầu với /auth
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;
    private final UserService userService;

    // API đăng nhập → nhận email + password → trả về access token + refresh token
    @PostMapping("/login")
    public ApiResponse<AuthResponse> login(@Valid @RequestBody LoginRequest request){
        return ApiResponse.<AuthResponse>builder()
                .result(authService.login(request))
                .message("Login successful")
                .build();
    }

    // API tạo access token mới dựa trên refresh token
    @PostMapping("/refresh")
    public ApiResponse<AuthResponse> refresh(@Valid @RequestBody RefreshRequest request){
        return ApiResponse.<AuthResponse>builder()
                .result(authService.refreshToken(request))
                .message("Refresh successful")
                .build();
    }

    // API đăng ký tài khoản mới
    @PostMapping("/register")
    public ApiResponse<RegisterResponse> register(@RequestBody RegisterRequest request){
        return ApiResponse.<RegisterResponse>builder()
                .result(userService.register(request))
                .message("Register successful")
                .build();
    }

    // API đăng xuất → thực chất là ghi token vào bảng blacklist (token vô hiệu hóa)
    @PostMapping("/logout")
    public ApiResponse<Void> logout(@RequestHeader("Authorization") String header){
        if (header == null || !header.startsWith("Bearer ")) {
            throw new RuntimeException("Missing token");
        }

        String token = header.substring(7);
        authService.logout(token);

        return ApiResponse.<Void>builder()
                .message("Logout successful")
                .build();
    }
}
