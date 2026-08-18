package com.portfolio.server.service.impl;

import com.portfolio.server.dto.response.HealthCheckResponse;
import com.portfolio.server.service.HealthCheckService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class HealthCheckServiceImpl implements HealthCheckService {

    private final JdbcTemplate jdbcTemplate;

    @Override
    public HealthCheckResponse checkDatabase() {
        try {
            Integer result = jdbcTemplate.queryForObject("SELECT 1", Integer.class);
            if (result != null && result == 1) {
                return HealthCheckResponse.builder()
                        .status("UP")
                        .database("UP")
                        .message("Database connection is healthy")
                        .build();
            } else {
                return HealthCheckResponse.builder()
                        .status("DOWN")
                        .database("DOWN")
                        .message("Database returned unexpected result")
                        .build();
            }
        } catch (Exception e) {
            log.error("Database health check failed: {}", e.getMessage(), e);
            return HealthCheckResponse.builder()
                    .status("DOWN")
                    .database("DOWN")
                    .message("Database connection failed: " + e.getMessage())
                    .build();
        }
    }
}
