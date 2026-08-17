package com.portfolio.server.dto.request;

import com.portfolio.server.enums.SkillCategory;
import jakarta.validation.constraints.Min;
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
public class SkillRequest {

    @NotBlank(message = "Title is required")
    @Size(max = 50, message = "Title must not exceed 50 characters")
    private String title;

    @NotBlank(message = "Icon class is required")
    @Size(max = 100, message = "Icon class must not exceed 100 characters")
    private String iconClass;

    @NotNull(message = "Category is required")
    private SkillCategory category;

    @NotNull(message = "Order index is required")
    @Min(value = 0, message = "Order index must be >= 0")
    private Integer orderIndex;
}
