package com.portfolio.server.service;

import com.portfolio.server.dto.response.UploadCvResponse;
import org.springframework.web.multipart.MultipartFile;

public interface PdfService {
    UploadCvResponse uploadCv(MultipartFile file);
}
