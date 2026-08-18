package com.portfolio.server.dto.response;

import com.portfolio.server.enums.SkillCategory;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SkillResponse {
    private Long id;
    
    private String title;
    
    private String iconClass;

    private SkillCategory category;

    private Integer orderIndex;
}
