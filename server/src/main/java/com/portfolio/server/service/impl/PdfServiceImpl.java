package com.portfolio.server.service.impl;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.portfolio.server.dto.response.UploadCvResponse;
import com.portfolio.server.entity.PersonalInfo;
import com.portfolio.server.exception.AppException;
import com.portfolio.server.exception.ErrorCode;
import com.portfolio.server.repository.PersonalInfoRepository;
import com.portfolio.server.service.PdfService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class PdfServiceImpl implements PdfService {

    private final Cloudinary cloudinary;
    private final PersonalInfoRepository personalInfoRepository;

    @org.springframework.beans.factory.annotation.Value("${cloudinary.upload-preset:}")
    private String uploadPreset;

    @Override
    @Transactional
    public UploadCvResponse uploadCv(MultipartFile file) {
        validatePdfFile(file);

        try {
            String originalFileName = file.getOriginalFilename();
            
            // Build upload params
            java.util.Map<String, Object> params = new java.util.HashMap<>();
            params.put("folder", "portfolio/cv");
            params.put("resource_type", "auto");
            params.put("format", "pdf");
            params.put("use_filename", true);
            params.put("unique_filename", true);

            if (uploadPreset != null && !uploadPreset.trim().isEmpty()) {
                params.put("upload_preset", uploadPreset.trim());
            }

            // Upload lên Cloudinary
            Map<?, ?> uploadResult = cloudinary.uploader().upload(file.getBytes(), params);

            String rawSecureUrl = (String) uploadResult.get("secure_url");
            String publicId = (String) uploadResult.get("public_id");

            // Đảm bảo URL có đuôi .pdf để trình duyệt nhận diện và mở bằng PDF viewer
            String finalUrl = (rawSecureUrl != null && !rawSecureUrl.toLowerCase().endsWith(".pdf"))
                    ? rawSecureUrl + ".pdf"
                    : rawSecureUrl;

            // Tự động cập nhật cv_url vào bảng personal_info nếu có record
            personalInfoRepository.findAll().stream().findFirst().ifPresent(info -> {
                info.setCvUrl(finalUrl);
                info.setUpdatedAt(LocalDateTime.now());
                personalInfoRepository.save(info);
            });

            log.info("Uploaded CV successfully: publicId={}, url={}", publicId, finalUrl);

            return UploadCvResponse.builder()
                    .url(finalUrl)
                    .publicId(publicId)
                    .originalFileName(originalFileName)
                    .size(file.getSize())
                    .build();

        } catch (IOException e) {
            log.error("Failed to upload CV to Cloudinary", e);
            throw new AppException(ErrorCode.FILE_UPLOAD_FAILED);
        }
    }

    private void validatePdfFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new AppException(ErrorCode.FILE_EMPTY);
        }

        String contentType = file.getContentType();
        String originalFilename = file.getOriginalFilename();

        boolean isPdfContentType = contentType != null && contentType.equalsIgnoreCase("application/pdf");
        boolean hasPdfExtension = originalFilename != null && originalFilename.toLowerCase().endsWith(".pdf");

        if (!isPdfContentType && !hasPdfExtension) {
            throw new AppException(ErrorCode.INVALID_FILE_TYPE);
        }
    }
}
