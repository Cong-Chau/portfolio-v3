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
import com.portfolio.server.service.AdminService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/v1/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

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
