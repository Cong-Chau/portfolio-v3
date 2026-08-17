package com.portfolio.server.controller;

import com.portfolio.server.dto.request.AboutDetailRequest;
import com.portfolio.server.dto.request.PersonalInfoRequest;
import com.portfolio.server.dto.request.ProjectRequest;
import com.portfolio.server.dto.request.SkillRequest;
import com.portfolio.server.dto.response.AboutDetailResponse;
import com.portfolio.server.dto.response.AdminProjectResponse;
import com.portfolio.server.dto.response.ApiResponse;
import com.portfolio.server.dto.response.PersonalInfoResponse;
import com.portfolio.server.dto.response.SkillResponse;
import com.portfolio.server.dto.response.UploadCvResponse;
import com.portfolio.server.dto.response.UploadImageResponse;
import com.portfolio.server.service.AdminService;
import com.portfolio.server.service.ImageService;
import com.portfolio.server.service.PdfService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/v1/admin")
@RequiredArgsConstructor
@Tag(name = "Admin", description = "Admin Management APIs")
public class AdminController {

    private final AdminService adminService;
    private final PdfService pdfService;
    private final ImageService imageService;

    @PostMapping(value = "/cv/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Upload file CV PDF lên Cloudinary")
    public ApiResponse<UploadCvResponse> uploadCv(
            @Parameter(description = "File CV định dạng PDF", required = true)
            @RequestParam("file") MultipartFile file) {
        UploadCvResponse result = pdfService.uploadCv(file);
        return ApiResponse.<UploadCvResponse>builder()
                .code(HttpStatus.OK.value())
                .result(result)
                .build();
    }

    @PostMapping(value = "/avatar/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Upload ảnh Avatar lên Cloudinary")
    public ApiResponse<UploadImageResponse> uploadAvatar(
            @Parameter(description = "File ảnh Avatar (JPG, PNG, WEBP, ...)", required = true)
            @RequestParam("file") MultipartFile file) {
        UploadImageResponse result = imageService.uploadAvatar(file);
        return ApiResponse.<UploadImageResponse>builder()
                .code(HttpStatus.OK.value())
                .result(result)
                .build();
    }

    @PostMapping(value = "/images/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Upload ảnh chung lên Cloudinary")
    public ApiResponse<UploadImageResponse> uploadImage(
            @Parameter(description = "File ảnh (JPG, PNG, WEBP, ...)", required = true)
            @RequestParam("file") MultipartFile file,
            @Parameter(description = "Thư mục lưu trữ trên Cloudinary (mặc định: portfolio/images)", required = false)
            @RequestParam(value = "folder", required = false) String folder) {
        UploadImageResponse result = imageService.uploadImage(file, folder);
        return ApiResponse.<UploadImageResponse>builder()
                .code(HttpStatus.OK.value())
                .result(result)
                .build();
    }

    @PutMapping("/personal")
    public ApiResponse<PersonalInfoResponse> updatePersonalInfo(
            @Valid @RequestBody PersonalInfoRequest request) {
        PersonalInfoResponse result = adminService.updatePersonalInfo(request);
        return ApiResponse.<PersonalInfoResponse>builder()
                .code(HttpStatus.OK.value())
                .result(result)
                .build();
    }

    @PostMapping("/about")
    public ApiResponse<AboutDetailResponse> createAbout(
            @Valid @RequestBody AboutDetailRequest request) {
        AboutDetailResponse result = adminService.createAbout(request);
        return ApiResponse.<AboutDetailResponse>builder()
                .code(HttpStatus.CREATED.value())
                .result(result)
                .build();
    }

    @PutMapping("/about/{id}")
    public ApiResponse<AboutDetailResponse> updateAbout(
            @PathVariable Long id,
            @Valid @RequestBody AboutDetailRequest request) {
        AboutDetailResponse result = adminService.updateAbout(id, request);
        return ApiResponse.<AboutDetailResponse>builder()
                .code(HttpStatus.OK.value())
                .result(result)
                .build();
    }

    @DeleteMapping("/about/{id}")
    public ApiResponse<Void> deleteAbout(@PathVariable Long id) {
        adminService.deleteAbout(id);
        return ApiResponse.<Void>builder()
                .code(HttpStatus.NO_CONTENT.value())
                .build();
    }

    // -------------------------------------------------------------------------
    // Skills
    // -------------------------------------------------------------------------

    @PostMapping("/skills")
    public ApiResponse<SkillResponse> createSkill(
            @Valid @RequestBody SkillRequest request) {
        SkillResponse result = adminService.createSkill(request);
        return ApiResponse.<SkillResponse>builder()
                .code(HttpStatus.CREATED.value())
                .result(result)
                .build();
    }

    @PutMapping("/skills/{id}")
    public ApiResponse<SkillResponse> updateSkill(
            @PathVariable Long id,
            @Valid @RequestBody SkillRequest request) {
        SkillResponse result = adminService.updateSkill(id, request);
        return ApiResponse.<SkillResponse>builder()
                .code(HttpStatus.OK.value())
                .result(result)
                .build();
    }

    @DeleteMapping("/skills/{id}")
    public ApiResponse<Void> deleteSkill(@PathVariable Long id) {
        adminService.deleteSkill(id);
        return ApiResponse.<Void>builder()
                .code(HttpStatus.NO_CONTENT.value())
                .build();
    }

    // -------------------------------------------------------------------------
    // Projects
    // -------------------------------------------------------------------------

    @PostMapping("/projects")
    public ApiResponse<AdminProjectResponse> createProject(
            @Valid @RequestBody ProjectRequest request) {
        AdminProjectResponse result = adminService.createProject(request);
        return ApiResponse.<AdminProjectResponse>builder()
                .code(HttpStatus.CREATED.value())
                .result(result)
                .build();
    }

    @PutMapping("/projects/{id}")
    public ApiResponse<AdminProjectResponse> updateProject(
            @PathVariable Long id,
            @Valid @RequestBody ProjectRequest request) {
        AdminProjectResponse result = adminService.updateProject(id, request);
        return ApiResponse.<AdminProjectResponse>builder()
                .code(HttpStatus.OK.value())
                .result(result)
                .build();
    }

    @DeleteMapping("/projects/{id}")
    public ApiResponse<Void> deleteProject(@PathVariable Long id) {
        adminService.deleteProject(id);
        return ApiResponse.<Void>builder()
                .code(HttpStatus.NO_CONTENT.value())
                .build();
    }
}
