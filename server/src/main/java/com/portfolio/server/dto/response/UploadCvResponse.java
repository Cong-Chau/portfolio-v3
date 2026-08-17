package com.portfolio.server.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UploadCvResponse {
    private String url;
    private String publicId;
    private String originalFileName;
    private Long size;
}
