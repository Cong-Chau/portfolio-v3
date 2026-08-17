package com.portfolio.server.controller;

import com.portfolio.server.dto.response.*;
import com.portfolio.server.service.PortfolioService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/v1/portfolio")
@RequiredArgsConstructor
public class PortfolioController {

    private final PortfolioService portfolioService;


    @GetMapping
    public com.portfolio.server.dto.response.ApiResponse<PortfolioResponse> getFullPortfolio(
            @RequestParam(defaultValue = "vi") String lang) {
        PortfolioResponse result = portfolioService.getFullPortfolio(lang);
        return com.portfolio.server.dto.response.ApiResponse.<PortfolioResponse>builder()
                .code(HttpStatus.OK.value())
                .result(result)
                .build();
    }

    @GetMapping("/personal")
    public com.portfolio.server.dto.response.ApiResponse<PersonalInfoResponse> getPersonalInfo(
            @RequestParam(defaultValue = "vi") String lang) {
        PersonalInfoResponse result = portfolioService.getPersonalInfo(lang);
        return com.portfolio.server.dto.response.ApiResponse.<PersonalInfoResponse>builder()
                .code(HttpStatus.OK.value())
                .result(result)
                .build();
    }

    @GetMapping("/about")
    public com.portfolio.server.dto.response.ApiResponse<List<String>> getAboutMes(
            @RequestParam(defaultValue = "vi") String lang) {
        List<String> result = portfolioService.getAboutMes(lang);
        return com.portfolio.server.dto.response.ApiResponse.<List<String>>builder()
                .code(HttpStatus.OK.value())
                .result(result)
                .build();
    }

    @GetMapping("/skills")
    public com.portfolio.server.dto.response.ApiResponse<SkillsResponse> getSkills() {
        SkillsResponse result = portfolioService.getSkills();
        return com.portfolio.server.dto.response.ApiResponse.<SkillsResponse>builder()
                .code(HttpStatus.OK.value())
                .result(result)
                .build();
    }

    @GetMapping("/projects")
    public com.portfolio.server.dto.response.ApiResponse<List<ProjectResponse>> getProjects(
            @RequestParam(defaultValue = "vi") String lang) {
        List<ProjectResponse> result = portfolioService.getProjects(lang);
        return com.portfolio.server.dto.response.ApiResponse.<List<ProjectResponse>>builder()
                .code(HttpStatus.OK.value())
                .result(result)
                .build();
    }
}
