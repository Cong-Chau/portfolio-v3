package com.portfolio.server.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AboutDetailRequest {

    @NotBlank(message = "Vietnamese content is required")
    private String contentVi;

    @NotBlank(message = "English content is required")
    private String contentEn;

    @NotNull(message = "Order index is required")
    @Min(value = 0, message = "Order index must be >= 0")
    private Integer orderIndex;
}
