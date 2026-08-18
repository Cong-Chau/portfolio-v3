package com.portfolio.server.service.impl;

import com.portfolio.server.dto.response.*;
import com.portfolio.server.entity.*;
import com.portfolio.server.enums.SkillCategory;
import com.portfolio.server.exception.AppException;
import com.portfolio.server.exception.ErrorCode;
import com.portfolio.server.repository.*;
import com.portfolio.server.service.PortfolioService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PortfolioServiceImpl implements PortfolioService {

    private final PersonalInfoRepository personalInfoRepository;
    private final AboutDetailRepository aboutDetailRepository;
    private final SkillRepository skillRepository;
    private final ProjectRepository projectRepository;

    @Override
    public PortfolioResponse getFullPortfolio(String lang) {
        String validatedLang = validateLang(lang);
        return PortfolioResponse.builder()
                .personal(getPersonalInfo(validatedLang))
                .aboutMes(getAboutMes(validatedLang))
                .skills(getSkills())
                .projects(getProjects(validatedLang))
                .build();
    }

    @Override
    public PersonalInfoResponse getPersonalInfo(String lang) {
        String validatedLang = validateLang(lang);
        PersonalInfo personalInfo = personalInfoRepository.findAll()
                .stream()
                .findFirst()
                .orElseThrow(() -> new AppException(ErrorCode.PERSONAL_INFO_NOT_FOUND));

        return mapPersonalInfoToResponse(personalInfo, validatedLang);
    }

    @Override
    public List<String> getAboutMes(String lang) {
        String validatedLang = validateLang(lang);
        List<AboutDetail> aboutDetails = aboutDetailRepository.findAllByOrderByOrderIndexAsc();

        return aboutDetails.stream()
                .map(detail -> "vi".equals(validatedLang) ? detail.getContentVi() : detail.getContentEn())
                .collect(Collectors.toList());
    }

    @Override
    public SkillsResponse getSkills() {
        List<SkillResponse> techs = skillRepository.findByCategoryOrderByOrderIndexAsc(SkillCategory.TECH)
                .stream()
                .map(this::mapSkillToResponse)
                .collect(Collectors.toList());

        List<SkillResponse> tools = skillRepository.findByCategoryOrderByOrderIndexAsc(SkillCategory.TOOL)
                .stream()
                .map(this::mapSkillToResponse)
                .collect(Collectors.toList());

        return SkillsResponse.builder()
                .techs(techs)
                .tools(tools)
                .build();
    }

    @Override
    public List<ProjectResponse> getProjects(String lang) {
        String validatedLang = validateLang(lang);
        List<Project> projects = projectRepository.findByIsVisibleTrueOrderByOrderIndexAsc();

        return projects.stream()
                .map(project -> mapProjectToResponse(project, validatedLang))
                .collect(Collectors.toList());
    }

    private String validateLang(String lang) {
        if (lang == null || lang.isBlank()) {
            return "vi";
        }
        if (!lang.equals("vi") && !lang.equals("en")) {
            throw new AppException(ErrorCode.INVALID_LANGUAGE);
        }
        return lang;
    }

    private PersonalInfoResponse mapPersonalInfoToResponse(PersonalInfo personalInfo, String lang) {
        String title = "vi".equals(lang) ? personalInfo.getTitleVi() : personalInfo.getTitleEn();
        String summary = "vi".equals(lang) ? personalInfo.getSummaryVi() : personalInfo.getSummaryEn();
        String location = "vi".equals(lang) ? personalInfo.getLocationVi() : personalInfo.getLocationEn();

        return PersonalInfoResponse.builder()
                .name(personalInfo.getName())
                .title(title)
                .summary(summary)
                .email(personalInfo.getEmail())
                .phone(personalInfo.getPhone())
                .location(location)
                .linkedinUrl(personalInfo.getLinkedinUrl())
                .githubUrl(personalInfo.getGithubUrl())
                .avatarUrl(personalInfo.getAvatarUrl())
                .cvUrl(personalInfo.getCvUrl())
                .build();
    }

    private SkillResponse mapSkillToResponse(Skill skill) {
        return SkillResponse.builder()
                .id(skill.getId())
                .title(skill.getTitle())
                .iconClass(skill.getIconClass())
                .build();
    }

    private ProjectResponse mapProjectToResponse(Project project, String lang) {
        String title = "vi".equals(lang) ? project.getTitleVi() : project.getTitleEn();
        String completeTime = "vi".equals(lang) ? project.getCompleteTimeVi() : project.getCompleteTimeEn();
        String description = "vi".equals(lang) ? project.getDescriptionVi() : project.getDescriptionEn();
        String highlight = "vi".equals(lang) ? project.getHighlightVi() : project.getHighlightEn();

        List<String> skillNames = project.getSkills()
                .stream()
                .map(Skill::getTitle)
                .collect(Collectors.toList());

        List<ProjectUrlResponse> urls = project.getProjectUrls()
                .stream()
                .map(projectUrl -> mapProjectUrlToResponse(projectUrl, lang))
                .collect(Collectors.toList());

        return ProjectResponse.builder()
                .id(project.getId())
                .title(title)
                .completeTime(completeTime)
                .description(description)
                .highlight(highlight)
                .skills(skillNames)
                .urls(urls)
                .build();
    }

    private ProjectUrlResponse mapProjectUrlToResponse(ProjectUrl projectUrl, String lang) {
        String label = "vi".equals(lang) ? projectUrl.getLabelVi() : projectUrl.getLabelEn();

        return ProjectUrlResponse.builder()
                .label(label)
                .url(projectUrl.getUrl())
                .build();
    }
}
