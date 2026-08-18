package com.portfolio.server.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TranslateRequest {

    @NotBlank(message = "Text to translate is required")
    private String text;

    @Builder.Default
    private String sourceLang = "vi";

    @NotBlank(message = "Target language is required")
    private String targetLang;

    private String context;
}
