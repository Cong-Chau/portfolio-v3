package com.portfolio.server.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PersonalInfoRequest {

    @NotBlank(message = "Name is required")
    @Size(max = 100, message = "Name must not exceed 100 characters")
    private String name;

    @NotBlank(message = "Vietnamese title is required")
    private String titleVi;

    @NotBlank(message = "English title is required")
    private String titleEn;

    @NotBlank(message = "Vietnamese summary is required")
    private String summaryVi;

    @NotBlank(message = "English summary is required")
    private String summaryEn;

    @NotBlank(message = "Email is required")
    @Email(message = "Email is invalid")
    @Size(max = 100, message = "Email must not exceed 100 characters")
    private String email;

    @NotBlank(message = "Phone is required")
    @Size(max = 20, message = "Phone must not exceed 20 characters")
    private String phone;

    @NotBlank(message = "Vietnamese location is required")
    @Size(max = 150, message = "Location must not exceed 150 characters")
    private String locationVi;

    @NotBlank(message = "English location is required")
    @Size(max = 150, message = "Location must not exceed 150 characters")
    private String locationEn;

    private String linkedinUrl;
    private String githubUrl;
    private String avatarUrl;
    private String cvUrl;
}
