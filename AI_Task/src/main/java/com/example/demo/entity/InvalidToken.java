package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "invalid_tokens")
public class InvalidToken {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String token;   // Chuỗi JWT đã bị vô hiệu hóa (đã logout)

    @Column(name = "expiry_time", nullable = false)
    private LocalDateTime expiryTime;   // Thời điểm token hết hạn → dùng để dọn rác token
}
