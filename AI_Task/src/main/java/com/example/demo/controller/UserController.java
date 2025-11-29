package com.example.demo.controller;

import com.example.demo.dto.request.UpdateUserRequest;
import com.example.demo.dto.response.ApiResponse;
import com.example.demo.dto.response.UserResponse;
import com.example.demo.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    // API cập nhật thông tin người dùng theo email
    @PutMapping("/update/{email}")
    public ApiResponse<UserResponse> userUpdate(@PathVariable String email, @RequestBody UpdateUserRequest request) {
        return ApiResponse.<UserResponse>builder()
                .result(userService.userUpdate(email, request))
                .message("User updated")
                .build();
    }

    // API lấy danh sách tất cả người dùng
    @GetMapping("/getAll")
    public ApiResponse<List<UserResponse>> getAll() {
        return ApiResponse.<List<UserResponse>>builder()
                .result(userService.getAllUser())
                .message("Get all users successfully")
                .build();
    }

    // API xóa người dùng
    @DeleteMapping("/delete/{email}")
    public ApiResponse<Boolean> userDelete(@PathVariable String email) {
        userService.deleteUser(email);
        return ApiResponse.<Boolean>builder()
                .result(true)
                .message("User deleted")
                .build();
    }

    // API lấy thông tin chi tiết của user theo email
    @GetMapping("/me/{email}")
    public ApiResponse<UserResponse> getUser(@PathVariable String email) {
        return ApiResponse.<UserResponse>builder()
                .result(userService.getUser(email))
                .build();
    }
}
