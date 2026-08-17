package com.portfolio.server.service;

import com.portfolio.server.dto.response.UploadImageResponse;
import org.springframework.web.multipart.MultipartFile;

public interface ImageService {
    UploadImageResponse uploadAvatar(MultipartFile file);
    UploadImageResponse uploadImage(MultipartFile file, String folder);
}
