package com.example.demo.repository;

import com.example.demo.entity.AiAnalysis;
import com.example.demo.entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AiAnalysisRepository extends JpaRepository<AiAnalysis, Long> {
    Optional<AiAnalysis> findByTask(Task task);
}
