package com.example.demo.repository;

import com.example.demo.entity.InvalidToken;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InvalidatedTokenRepository extends JpaRepository<InvalidToken, Long> {
    boolean existsByToken(String token);
}
