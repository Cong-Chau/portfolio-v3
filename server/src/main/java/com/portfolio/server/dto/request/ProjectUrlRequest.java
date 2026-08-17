package com.portfolio.server.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProjectUrlRequest {

    @NotBlank(message = "Vietnamese label is required")
    @Size(max = 50, message = "Label must not exceed 50 characters")
    private String labelVi;

    @NotBlank(message = "English label is required")
    @Size(max = 50, message = "Label must not exceed 50 characters")
    private String labelEn;

    @NotNull(message = "URL is required")
    private String url;
}
