package com.portfolio.server.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminProjectUrlResponse {
    private String labelVi;
    private String labelEn;
    private String url;
}
