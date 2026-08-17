package com.portfolio.server.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AboutDetailResponse {

    private Long id;
    private String contentVi;
    private String contentEn;
    private Integer orderIndex;
}
