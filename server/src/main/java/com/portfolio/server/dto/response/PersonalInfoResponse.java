package com.portfolio.server.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PersonalInfoResponse {
    private String name;
    
    private String title;
    
    private String summary;
    
    private String email;

    private String phone;
    
    private String location;
    
    private String linkedinUrl;
    
    private String githubUrl;
    
    private String avatarUrl;
    
    private String cvUrl;
}
