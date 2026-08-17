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
public class ProjectResponse {
    private Long id;
    
    private String title;
    
    private String completeTime;
    
    private String description;
    
    private String highlight;
    
    private List<String> skills;
    
    private List<ProjectUrlResponse> urls;
}
