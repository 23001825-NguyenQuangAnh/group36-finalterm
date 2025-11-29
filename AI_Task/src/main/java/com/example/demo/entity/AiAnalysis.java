package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "ai_analysis")
public class AiAnalysis {

    @Id  // Khóa chính
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Tự tăng trong DB
    private Long id;

    // ===== Input =====
    @Lob
    @Column(name = "raw_description")
    private String rawDescription; // Mô tả gốc người dùng nhập vào

    // ===== Output từ AI =====
    @Column(name = "parsed_deadline")
    private LocalDateTime parsedDeadline; // Deadline mà AI phân tích được từ văn bản

    private Double urgency;     // Mức độ khẩn cấp (AI dự đoán)

    private Double importance;  // Mức độ quan trọng

    @Column(name = "category_name")
    private String categoryName;  // Category AI phân loại

    @Column(name = "priority_score") // Điểm ưu tiên cuối cùng (tính từ urgency + importance)
    private Double priorityScore;

    // ===== Metadata =====
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Quan hệ 1-1 với Task
    @OneToOne
    @JoinColumn(name = "task_id")
    private Task task;

    // ===== Hooks =====
    @PrePersist
    public void prePersist() {
        createdAt = LocalDateTime.now();
    }

    @PreUpdate
    public void preUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
