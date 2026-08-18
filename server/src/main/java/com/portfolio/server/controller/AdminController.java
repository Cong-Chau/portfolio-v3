package com.portfolio.server.controller;

import com.portfolio.server.dto.request.AboutDetailRequest;
import com.portfolio.server.dto.request.PersonalInfoRequest;
import com.portfolio.server.dto.request.ProjectRequest;
import com.portfolio.server.dto.request.SkillRequest;
import com.portfolio.server.dto.response.AboutDetailResponse;
import com.portfolio.server.dto.response.AdminPersonalInfoResponse;
import com.portfolio.server.dto.response.AdminProjectResponse;
import com.portfolio.server.dto.response.ApiResponse;
import com.portfolio.server.dto.response.SkillResponse;
import com.portfolio.server.dto.response.UploadCvResponse;
import com.portfolio.server.dto.response.UploadImageResponse;
import com.portfolio.server.dto.request.TranslateRequest;
import com.portfolio.server.dto.response.TranslateResponse;
import com.portfolio.server.service.AdminService;
import com.portfolio.server.service.ImageService;
import com.portfolio.server.service.PdfService;
import com.portfolio.server.service.TranslationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/v1/admin")
@RequiredArgsConstructor
@Tag(name = "Admin", description = "Admin Management APIs")
public class AdminController {

    private final AdminService adminService;
    private final PdfService pdfService;
    private final ImageService imageService;
    private final TranslationService translationService;

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

    @GetMapping("/personal")
    @Operation(summary = "Lấy thông tin cá nhân đầy đủ song ngữ cho Admin")
    public ApiResponse<AdminPersonalInfoResponse> getPersonalInfo() {
        AdminPersonalInfoResponse result = adminService.getPersonalInfo();
        return ApiResponse.<AdminPersonalInfoResponse>builder()
                .code(HttpStatus.OK.value())
                .result(result)
                .build();
    }

    @PutMapping("/personal")
    @Operation(summary = "Cập nhật thông tin cá nhân")
    public ApiResponse<AdminPersonalInfoResponse> updatePersonalInfo(
            @Valid @RequestBody PersonalInfoRequest request) {
        AdminPersonalInfoResponse result = adminService.updatePersonalInfo(request);
        return ApiResponse.<AdminPersonalInfoResponse>builder()
                .code(HttpStatus.OK.value())
                .result(result)
                .build();
    }

    @GetMapping("/about")
    @Operation(summary = "Lấy danh sách tất cả About Details cho Admin")
    public ApiResponse<List<AboutDetailResponse>> getAbouts() {
        List<AboutDetailResponse> result = adminService.getAbouts();
        return ApiResponse.<List<AboutDetailResponse>>builder()
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

    @GetMapping("/skills")
    @Operation(summary = "Lấy danh sách tất cả Skills cho Admin")
    public ApiResponse<List<SkillResponse>> getSkills() {
        List<SkillResponse> result = adminService.getSkills();
        return ApiResponse.<List<SkillResponse>>builder()
                .code(HttpStatus.OK.value())
                .result(result)
                .build();
    }

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

    @GetMapping("/projects")
    @Operation(summary = "Lấy danh sách tất cả Projects cho Admin")
    public ApiResponse<List<AdminProjectResponse>> getProjects() {
        List<AdminProjectResponse> result = adminService.getProjects();
        return ApiResponse.<List<AdminProjectResponse>>builder()
                .code(HttpStatus.OK.value())
                .result(result)
                .build();
    }

    @GetMapping("/projects/{id}")
    @Operation(summary = "Lấy chi tiết một Project cho Admin")
    public ApiResponse<AdminProjectResponse> getProjectById(@PathVariable Long id) {
        AdminProjectResponse result = adminService.getProjectById(id);
        return ApiResponse.<AdminProjectResponse>builder()
                .code(HttpStatus.OK.value())
                .result(result)
                .build();
    }

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

    @PatchMapping("/projects/{id}/toggle-visibility")
    @Operation(summary = "Bật/tắt trạng thái hiển thị dự án trên Portfolio")
    public ApiResponse<AdminProjectResponse> toggleProjectVisibility(@PathVariable Long id) {
        AdminProjectResponse result = adminService.toggleProjectVisibility(id);
        return ApiResponse.<AdminProjectResponse>builder()
                .code(HttpStatus.OK.value())
                .result(result)
                .build();
    }

    @DeleteMapping("/projects/{id}")
    @Operation(summary = "Ẩn dự án khỏi Portfolio (Soft Delete)")
    public ApiResponse<Void> deleteProject(@PathVariable Long id) {
        adminService.deleteProject(id);
        return ApiResponse.<Void>builder()
                .code(HttpStatus.NO_CONTENT.value())
                .build();
    }

    // -------------------------------------------------------------------------
    // AI Translation
    // -------------------------------------------------------------------------

    @PostMapping("/translate")
    @Operation(summary = "Dịch văn bản giữa Tiếng Việt và Tiếng Anh sử dụng Gemini AI")
    public ApiResponse<TranslateResponse> translate(
            @Valid @RequestBody TranslateRequest request) {
        TranslateResponse result = translationService.translate(request);
        return ApiResponse.<TranslateResponse>builder()
                .code(HttpStatus.OK.value())
                .result(result)
                .build();
    }
}
