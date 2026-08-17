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
public class PortfolioResponse {
    private PersonalInfoResponse personal;
    
    private List<String> aboutMes;
    
    private SkillsResponse skills;
    
    private List<ProjectResponse> projects;
}
