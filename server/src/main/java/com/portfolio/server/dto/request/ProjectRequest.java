package com.portfolio.server.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProjectRequest {

    @NotBlank(message = "Vietnamese title is required")
    private String titleVi;

    @NotBlank(message = "English title is required")
    private String titleEn;

    @NotBlank(message = "Vietnamese complete time is required")
    private String completeTimeVi;

    @NotBlank(message = "English complete time is required")
    private String completeTimeEn;

    @NotBlank(message = "Vietnamese description is required")
    private String descriptionVi;

    @NotBlank(message = "English description is required")
    private String descriptionEn;

    @NotBlank(message = "Vietnamese highlight is required")
    private String highlightVi;

    @NotBlank(message = "English highlight is required")
    private String highlightEn;

    @NotNull(message = "Order index is required")
    @Min(value = 0, message = "Order index must be >= 0")
    private Integer orderIndex;

    @Builder.Default
    private Boolean isVisible = true;

    @Builder.Default
    private List<Long> skillIds = new ArrayList<>();

    @Valid
    @Builder.Default
    private List<ProjectUrlRequest> urls = new ArrayList<>();
}
