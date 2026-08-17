package com.portfolio.server.service.impl;

import com.cloudinary.Cloudinary;
import com.portfolio.server.dto.response.UploadImageResponse;
import com.portfolio.server.entity.PersonalInfo;
import com.portfolio.server.exception.AppException;
import com.portfolio.server.exception.ErrorCode;
import com.portfolio.server.repository.PersonalInfoRepository;
import com.portfolio.server.service.ImageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class ImageServiceImpl implements ImageService {

    private final Cloudinary cloudinary;
    private final PersonalInfoRepository personalInfoRepository;

    @Value("${cloudinary.upload-preset:}")
    private String uploadPreset;

    private static final List<String> ALLOWED_EXTENSIONS = Arrays.asList(
            ".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg", ".bmp", ".avif"
    );

    @Override
    @Transactional
    public UploadImageResponse uploadAvatar(MultipartFile file) {
        UploadImageResponse response = uploadImage(file, "portfolio/avatar");

        // Tự động cập nhật avatar_url vào bảng personal_info
        personalInfoRepository.findAll().stream().findFirst().ifPresent(info -> {
            info.setAvatarUrl(response.getUrl());
            info.setUpdatedAt(LocalDateTime.now());
            personalInfoRepository.save(info);
        });

        log.info("Updated personal_info avatar_url: {}", response.getUrl());
        return response;
    }

    @Override
    public UploadImageResponse uploadImage(MultipartFile file, String folder) {
        validateImageFile(file);

        try {
            String originalFileName = file.getOriginalFilename();
            String targetFolder = (folder != null && !folder.trim().isEmpty()) ? folder.trim() : "portfolio/images";

            Map<String, Object> params = new HashMap<>();
            params.put("folder", targetFolder);
            params.put("resource_type", "image");
            params.put("use_filename", true);
            params.put("unique_filename", true);

            if (uploadPreset != null && !uploadPreset.trim().isEmpty()) {
                params.put("upload_preset", uploadPreset.trim());
            }

            Map<?, ?> uploadResult = cloudinary.uploader().upload(file.getBytes(), params);

            String secureUrl = (String) uploadResult.get("secure_url");
            String publicId = (String) uploadResult.get("public_id");
            Integer width = uploadResult.get("width") instanceof Number ? ((Number) uploadResult.get("width")).intValue() : null;
            Integer height = uploadResult.get("height") instanceof Number ? ((Number) uploadResult.get("height")).intValue() : null;
            String format = (String) uploadResult.get("format");

            log.info("Uploaded image successfully: publicId={}, url={}", publicId, secureUrl);

            return UploadImageResponse.builder()
                    .url(secureUrl)
                    .publicId(publicId)
                    .originalFileName(originalFileName)
                    .size(file.getSize())
                    .width(width)
                    .height(height)
                    .format(format)
                    .build();

        } catch (IOException e) {
            log.error("Failed to upload image to Cloudinary", e);
            throw new AppException(ErrorCode.FILE_UPLOAD_FAILED);
        }
    }

    private void validateImageFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new AppException(ErrorCode.FILE_EMPTY);
        }

        String contentType = file.getContentType();
        String originalFilename = file.getOriginalFilename();

        boolean isImageContentType = contentType != null && contentType.toLowerCase().startsWith("image/");
        boolean hasImageExtension = originalFilename != null && ALLOWED_EXTENSIONS.stream()
                .anyMatch(ext -> originalFilename.toLowerCase().endsWith(ext));

        if (!isImageContentType && !hasImageExtension) {
            throw new AppException(ErrorCode.INVALID_IMAGE_TYPE);
        }
    }
}
