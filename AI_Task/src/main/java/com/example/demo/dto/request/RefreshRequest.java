package com.example.demo.dto.request;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class RefreshRequest {
    private String refreshToken;
}
