package com.portfolio.server.controller;

import com.portfolio.server.dto.response.ApiResponse;
import com.portfolio.server.dto.response.HealthCheckResponse;
import com.portfolio.server.service.HealthCheckService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/v1/health")
@RequiredArgsConstructor
public class HealthController {

    private final HealthCheckService healthCheckService;

    @GetMapping
    public ResponseEntity<ApiResponse<HealthCheckResponse>> checkHealth() {
        HealthCheckResponse health = healthCheckService.checkDatabase();
        HttpStatus status = "UP".equals(health.getStatus()) ? HttpStatus.OK : HttpStatus.SERVICE_UNAVAILABLE;
        return ResponseEntity.status(status).body(
                ApiResponse.<HealthCheckResponse>builder()
                        .code(status.value())
                        .result(health)
                        .build()
        );
    }
}
