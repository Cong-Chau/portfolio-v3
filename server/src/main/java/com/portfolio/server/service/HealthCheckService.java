package com.portfolio.server.service;

import com.portfolio.server.dto.response.HealthCheckResponse;

public interface HealthCheckService {
    HealthCheckResponse checkDatabase();
}
