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

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ===== Input =====
    @Lob
    @Column(name = "raw_description")
    private String rawDescription;

    // ===== Output từ AI =====
    @Column(name = "parsed_deadline")
    private LocalDateTime parsedDeadline;

    private Double urgency;

    private Double importance;

    @Column(name = "category_name")
    private String categoryName;  // ⚡ Đã đổi tên cho đúng chuẩn

    @Column(name = "priority_score")
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
