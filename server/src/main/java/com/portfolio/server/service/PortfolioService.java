package com.portfolio.server.service;

import com.portfolio.server.dto.response.*;

import java.util.List;

public interface PortfolioService {
    PortfolioResponse getFullPortfolio(String lang);
    PersonalInfoResponse getPersonalInfo(String lang);
    List<String> getAboutMes(String lang);
    SkillsResponse getSkills();
    List<ProjectResponse> getProjects(String lang);
}
