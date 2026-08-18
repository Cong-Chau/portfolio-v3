package com.portfolio.server.service.impl;

import com.portfolio.server.dto.request.AboutDetailRequest;
import com.portfolio.server.dto.request.PersonalInfoRequest;
import com.portfolio.server.dto.request.ProjectRequest;
import com.portfolio.server.dto.request.SkillRequest;
import com.portfolio.server.dto.response.AboutDetailResponse;
import com.portfolio.server.dto.response.AdminPersonalInfoResponse;
import com.portfolio.server.dto.response.AdminProjectResponse;
import com.portfolio.server.dto.response.AdminProjectUrlResponse;
import com.portfolio.server.dto.response.SkillResponse;
import com.portfolio.server.entity.AboutDetail;
import com.portfolio.server.entity.PersonalInfo;
import com.portfolio.server.entity.Project;
import com.portfolio.server.entity.ProjectUrl;
import com.portfolio.server.entity.Skill;
import com.portfolio.server.exception.AppException;
import com.portfolio.server.exception.ErrorCode;
import com.portfolio.server.repository.AboutDetailRepository;
import com.portfolio.server.repository.PersonalInfoRepository;
import com.portfolio.server.repository.ProjectRepository;
import com.portfolio.server.repository.ProjectUrlRepository;
import com.portfolio.server.repository.SkillRepository;
import com.portfolio.server.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {

    private final PersonalInfoRepository personalInfoRepository;
    private final AboutDetailRepository aboutDetailRepository;
    private final SkillRepository skillRepository;
    private final ProjectRepository projectRepository;
    private final ProjectUrlRepository projectUrlRepository;

    @Override
    public AdminPersonalInfoResponse getPersonalInfo() {
        PersonalInfo personalInfo = personalInfoRepository.findAll()
                .stream()
                .findFirst()
                .orElseThrow(() -> new AppException(ErrorCode.PERSONAL_INFO_NOT_FOUND));
        return mapToAdminPersonalResponse(personalInfo);
    }

    @Override
    @Transactional
    public AdminPersonalInfoResponse updatePersonalInfo(PersonalInfoRequest request) {
        PersonalInfo personalInfo = personalInfoRepository.findAll()
                .stream()
                .findFirst()
                .orElseThrow(() -> new AppException(ErrorCode.PERSONAL_INFO_NOT_FOUND));

        personalInfo.setName(request.getName());
        personalInfo.setTitleVi(request.getTitleVi());
        personalInfo.setTitleEn(request.getTitleEn());
        personalInfo.setSummaryVi(request.getSummaryVi());
        personalInfo.setSummaryEn(request.getSummaryEn());
        personalInfo.setEmail(request.getEmail());
        personalInfo.setPhone(request.getPhone());
        personalInfo.setLocationVi(request.getLocationVi());
        personalInfo.setLocationEn(request.getLocationEn());
        personalInfo.setLinkedinUrl(request.getLinkedinUrl());
        personalInfo.setGithubUrl(request.getGithubUrl());
        personalInfo.setAvatarUrl(request.getAvatarUrl());
        personalInfo.setCvUrl(request.getCvUrl());

        PersonalInfo saved = personalInfoRepository.save(personalInfo);

        return mapToAdminPersonalResponse(saved);
    }

    private AdminPersonalInfoResponse mapToAdminPersonalResponse(PersonalInfo personalInfo) {
        return AdminPersonalInfoResponse.builder()
                .name(personalInfo.getName())
                .titleVi(personalInfo.getTitleVi())
                .titleEn(personalInfo.getTitleEn())
                .summaryVi(personalInfo.getSummaryVi())
                .summaryEn(personalInfo.getSummaryEn())
                .email(personalInfo.getEmail())
                .phone(personalInfo.getPhone())
                .locationVi(personalInfo.getLocationVi())
                .locationEn(personalInfo.getLocationEn())
                .linkedinUrl(personalInfo.getLinkedinUrl())
                .githubUrl(personalInfo.getGithubUrl())
                .avatarUrl(personalInfo.getAvatarUrl())
                .cvUrl(personalInfo.getCvUrl())
                .build();
    }

    // -------------------------------------------------------------------------
    // About
    // -------------------------------------------------------------------------

    @Override
    public List<AboutDetailResponse> getAbouts() {
        return aboutDetailRepository.findAllByOrderByOrderIndexAsc().stream()
                .map(this::mapAboutToResponse)
                .toList();
    }

    @Override
    @Transactional
    public AboutDetailResponse createAbout(AboutDetailRequest request) {
        AboutDetail aboutDetail = AboutDetail.builder()
                .contentVi(request.getContentVi())
                .contentEn(request.getContentEn())
                .orderIndex(request.getOrderIndex())
                .build();

        AboutDetail saved = aboutDetailRepository.save(aboutDetail);
        return mapAboutToResponse(saved);
    }

    private AboutDetailResponse mapAboutToResponse(AboutDetail aboutDetail) {
        return AboutDetailResponse.builder()
                .id(aboutDetail.getId())
                .contentVi(aboutDetail.getContentVi())
                .contentEn(aboutDetail.getContentEn())
                .orderIndex(aboutDetail.getOrderIndex())
                .build();
    }

    @Override
    @Transactional
    public AboutDetailResponse updateAbout(Long id, AboutDetailRequest request) {
        AboutDetail aboutDetail = aboutDetailRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.ABOUT_NOT_FOUND));

        aboutDetail.setContentVi(request.getContentVi());
        aboutDetail.setContentEn(request.getContentEn());
        aboutDetail.setOrderIndex(request.getOrderIndex());

        AboutDetail saved = aboutDetailRepository.save(aboutDetail);
        return mapAboutToResponse(saved);
    }

    @Override
    @Transactional
    public void deleteAbout(Long id) {
        if (!aboutDetailRepository.existsById(id)) {
            throw new AppException(ErrorCode.ABOUT_NOT_FOUND);
        }
        aboutDetailRepository.deleteById(id);
    }

    // -------------------------------------------------------------------------
    // Skill
    // -------------------------------------------------------------------------

    @Override
    public List<SkillResponse> getSkills() {
        return skillRepository.findAllByOrderByOrderIndexAsc().stream()
                .map(this::mapSkillToResponse)
                .toList();
    }

    @Override
    @Transactional
    public SkillResponse createSkill(SkillRequest request) {
        Skill skill = Skill.builder()
                .title(request.getTitle())
                .iconClass(request.getIconClass())
                .category(request.getCategory())
                .orderIndex(request.getOrderIndex())
                .build();

        Skill saved = skillRepository.save(skill);
        return mapSkillToResponse(saved);
    }

    private SkillResponse mapSkillToResponse(Skill skill) {
        return SkillResponse.builder()
                .id(skill.getId())
                .title(skill.getTitle())
                .iconClass(skill.getIconClass())
                .category(skill.getCategory())
                .orderIndex(skill.getOrderIndex())
                .build();
    }

    @Override
    @Transactional
    public SkillResponse updateSkill(Long id, SkillRequest request) {
        Skill skill = skillRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.SKILL_NOT_FOUND));

        skill.setTitle(request.getTitle());
        skill.setIconClass(request.getIconClass());
        skill.setCategory(request.getCategory());
        skill.setOrderIndex(request.getOrderIndex());

        Skill saved = skillRepository.save(skill);
        return mapSkillToResponse(saved);
    }

    @Override
    @Transactional
    public void deleteSkill(Long id) {
        if (!skillRepository.existsById(id)) {
            throw new AppException(ErrorCode.SKILL_NOT_FOUND);
        }
        skillRepository.deleteById(id);
    }

    // -------------------------------------------------------------------------
    // Project
    // -------------------------------------------------------------------------

    @Override
    public List<AdminProjectResponse> getProjects() {
        return projectRepository.findAllByOrderByOrderIndexAsc().stream()
                .map(project -> mapProjectToResponse(project, project.getProjectUrls()))
                .toList();
    }

    @Override
    public AdminProjectResponse getProjectById(Long id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.PROJECT_NOT_FOUND));
        return mapProjectToResponse(project, project.getProjectUrls());
    }

    @Override
    @Transactional
    public AdminProjectResponse createProject(ProjectRequest request) {
        // Resolve skills
        Set<Skill> skills = new HashSet<>(skillRepository.findAllById(request.getSkillIds()));

        // Build project
        Project project = Project.builder()
                .titleVi(request.getTitleVi())
                .titleEn(request.getTitleEn())
                .completeTimeVi(request.getCompleteTimeVi())
                .completeTimeEn(request.getCompleteTimeEn())
                .descriptionVi(request.getDescriptionVi())
                .descriptionEn(request.getDescriptionEn())
                .highlightVi(request.getHighlightVi())
                .highlightEn(request.getHighlightEn())
                .orderIndex(request.getOrderIndex())
                .isVisible(request.getIsVisible() != null ? request.getIsVisible() : true)
                .skills(skills)
                .createdAt(LocalDateTime.now())
                .build();

        Project savedProject = projectRepository.save(project);

        // Build URLs
        List<ProjectUrl> urls = request.getUrls().stream()
                .map(urlReq -> ProjectUrl.builder()
                        .project(savedProject)
                        .labelVi(urlReq.getLabelVi())
                        .labelEn(urlReq.getLabelEn())
                        .url(urlReq.getUrl())
                        .build())
                .collect(java.util.stream.Collectors.toList());

        List<ProjectUrl> savedUrls = projectUrlRepository.saveAll(urls);

        return mapProjectToResponse(savedProject, savedUrls);
    }

    @Override
    @Transactional
    public AdminProjectResponse updateProject(Long id, ProjectRequest request) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.PROJECT_NOT_FOUND));

        // Update basic fields
        project.setTitleVi(request.getTitleVi());
        project.setTitleEn(request.getTitleEn());
        project.setCompleteTimeVi(request.getCompleteTimeVi());
        project.setCompleteTimeEn(request.getCompleteTimeEn());
        project.setDescriptionVi(request.getDescriptionVi());
        project.setDescriptionEn(request.getDescriptionEn());
        project.setHighlightVi(request.getHighlightVi());
        project.setHighlightEn(request.getHighlightEn());
        project.setOrderIndex(request.getOrderIndex());
        if (request.getIsVisible() != null) {
            project.setIsVisible(request.getIsVisible());
        }

        // Update skills
        Set<Skill> skills = new HashSet<>(skillRepository.findAllById(request.getSkillIds()));
        project.setSkills(skills);

        Project savedProject = projectRepository.save(project);

        // Replace URLs (delete old, insert new)
        projectUrlRepository.deleteAll(project.getProjectUrls());
        project.getProjectUrls().clear();

        List<ProjectUrl> urls = request.getUrls().stream()
                .map(urlReq -> ProjectUrl.builder()
                        .project(savedProject)
                        .labelVi(urlReq.getLabelVi())
                        .labelEn(urlReq.getLabelEn())
                        .url(urlReq.getUrl())
                        .build())
                .collect(java.util.stream.Collectors.toList());

        List<ProjectUrl> savedUrls = projectUrlRepository.saveAll(urls);

        return mapProjectToResponse(savedProject, savedUrls);
    }

    @Override
    @Transactional
    public AdminProjectResponse toggleProjectVisibility(Long id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.PROJECT_NOT_FOUND));
        project.setIsVisible(!Boolean.TRUE.equals(project.getIsVisible()));
        Project saved = projectRepository.save(project);
        return mapProjectToResponse(saved, saved.getProjectUrls());
    }

    @Override
    @Transactional
    public void deleteProject(Long id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.PROJECT_NOT_FOUND));
        // Soft delete: chuyển sang trạng thái ẩn (isVisible = false)
        project.setIsVisible(false);
        projectRepository.save(project);
    }

    private AdminProjectResponse mapProjectToResponse(Project project, Collection<ProjectUrl> urls) {
        List<SkillResponse> skillResponses = project.getSkills() != null
                ? project.getSkills().stream()
                        .map(this::mapSkillToResponse)
                        .collect(java.util.stream.Collectors.toList())
                : java.util.Collections.emptyList();

        List<AdminProjectUrlResponse> urlResponses = urls != null
                ? urls.stream()
                        .map(u -> AdminProjectUrlResponse.builder()
                                .labelVi(u.getLabelVi())
                                .labelEn(u.getLabelEn())
                                .url(u.getUrl())
                                .build())
                        .collect(java.util.stream.Collectors.toList())
                : java.util.Collections.emptyList();

        return AdminProjectResponse.builder()
                .id(project.getId())
                .titleVi(project.getTitleVi())
                .titleEn(project.getTitleEn())
                .completeTimeVi(project.getCompleteTimeVi())
                .completeTimeEn(project.getCompleteTimeEn())
                .descriptionVi(project.getDescriptionVi())
                .descriptionEn(project.getDescriptionEn())
                .highlightVi(project.getHighlightVi())
                .highlightEn(project.getHighlightEn())
                .orderIndex(project.getOrderIndex())
                .isVisible(project.getIsVisible() != null ? project.getIsVisible() : true)
                .skills(skillResponses)
                .urls(urlResponses)
                .build();
    }
}
