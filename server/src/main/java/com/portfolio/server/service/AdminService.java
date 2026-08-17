package com.portfolio.server.service;

import com.portfolio.server.dto.request.AboutDetailRequest;
import com.portfolio.server.dto.request.PersonalInfoRequest;
import com.portfolio.server.dto.request.ProjectRequest;
import com.portfolio.server.dto.request.SkillRequest;
import com.portfolio.server.dto.response.AboutDetailResponse;
import com.portfolio.server.dto.response.AdminProjectResponse;
import com.portfolio.server.dto.response.PersonalInfoResponse;
import com.portfolio.server.dto.response.SkillResponse;

public interface AdminService {

    PersonalInfoResponse updatePersonalInfo(PersonalInfoRequest request);

    AboutDetailResponse createAbout(AboutDetailRequest request);

    AboutDetailResponse updateAbout(Long id, AboutDetailRequest request);

    void deleteAbout(Long id);

    SkillResponse createSkill(SkillRequest request);

    SkillResponse updateSkill(Long id, SkillRequest request);

    void deleteSkill(Long id);

    AdminProjectResponse createProject(ProjectRequest request);

    AdminProjectResponse updateProject(Long id, ProjectRequest request);

    void deleteProject(Long id);
}
