package com.portfolio.server.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UploadImageResponse {
    private String url;
    private String publicId;
    private String originalFileName;
    private Long size;
    private Integer width;
    private Integer height;
    private String format;
}
