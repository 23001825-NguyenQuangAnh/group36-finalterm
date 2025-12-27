package com.example.demo.entity;

import com.example.demo.enums.PriorityLevel;
import com.example.demo.enums.TaskStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
@Table(name = "tasks")
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 255)
    private String title;   // Tiêu đề task

    @Lob
    private String description; // Mô tả task

    @Column(name = "duration_minutes", columnDefinition = "INT DEFAULT 0")
    private Integer durationMinutes;    // Thời lượng task

    private LocalDateTime deadline;      // Deadline của task


    // =======================
    //  ⭐ AI fields (NEW) ⭐
    // =======================
    @Column(name = "urgency")
    private Double urgency;      // Điểm mức độ khẩn cấp

    @Column(name = "importance")
    private Double importance;   // Điểm mức độ quan trọng

    @Column(name = "priority_score")
    private Double priorityScore; // Điểm ưu tiên tổng hợp


    @Enumerated(EnumType.STRING)
    @Column(name = "priority_level", columnDefinition = "ENUM('NORMAL','HIGH') DEFAULT 'NORMAL'")
    private PriorityLevel priorityLevel = PriorityLevel.NORMAL;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", columnDefinition = "ENUM('PENDING','IN_PROGRESS','COMPLETED') DEFAULT 'PENDING'")
    private TaskStatus status = TaskStatus.PENDING;


    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;


    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }


    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;

    @OneToOne(mappedBy = "task", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private AiAnalysis aiAnalysis;

    @OneToMany(mappedBy = "task", fetch = FetchType.LAZY)
    private List<Notification> notifications = new ArrayList<>();
}
