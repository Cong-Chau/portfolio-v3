package com.portfolio.server.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminProjectResponse {
    private Long id;
    private String titleVi;
    private String titleEn;
    private String completeTimeVi;
    private String completeTimeEn;
    private String descriptionVi;
    private String descriptionEn;
    private String highlightVi;
    private String highlightEn;
    private Integer orderIndex;
    private List<SkillResponse> skills;
    private List<AdminProjectUrlResponse> urls;
}
