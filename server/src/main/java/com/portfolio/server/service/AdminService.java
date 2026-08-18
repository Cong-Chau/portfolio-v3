package com.portfolio.server.service;

import com.portfolio.server.dto.request.AboutDetailRequest;
import com.portfolio.server.dto.request.PersonalInfoRequest;
import com.portfolio.server.dto.request.ProjectRequest;
import com.portfolio.server.dto.request.SkillRequest;
import com.portfolio.server.dto.response.AboutDetailResponse;
import com.portfolio.server.dto.response.AdminPersonalInfoResponse;
import com.portfolio.server.dto.response.AdminProjectResponse;
import com.portfolio.server.dto.response.SkillResponse;

import java.util.List;

public interface AdminService {

    AdminPersonalInfoResponse getPersonalInfo();

    AdminPersonalInfoResponse updatePersonalInfo(PersonalInfoRequest request);

    List<AboutDetailResponse> getAbouts();

    AboutDetailResponse createAbout(AboutDetailRequest request);

    AboutDetailResponse updateAbout(Long id, AboutDetailRequest request);

    void deleteAbout(Long id);

    List<SkillResponse> getSkills();

    SkillResponse createSkill(SkillRequest request);

    SkillResponse updateSkill(Long id, SkillRequest request);

    void deleteSkill(Long id);

    List<AdminProjectResponse> getProjects();

    AdminProjectResponse getProjectById(Long id);

    AdminProjectResponse createProject(ProjectRequest request);

    AdminProjectResponse updateProject(Long id, ProjectRequest request);

    AdminProjectResponse toggleProjectVisibility(Long id);

    void deleteProject(Long id);
}
