package com.portfolio.server.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminPersonalInfoResponse {

    private String name;
    private String titleVi;
    private String titleEn;
    private String summaryVi;
    private String summaryEn;
    private String email;
    private String phone;
    private String locationVi;
    private String locationEn;
    private String linkedinUrl;
    private String githubUrl;
    private String avatarUrl;
    private String cvUrl;
}
