package com.portfolio.server.repository;

import com.portfolio.server.entity.ProjectUrl;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectUrlRepository extends JpaRepository<ProjectUrl, Long> {
    List<ProjectUrl> findByProjectId(Long projectId);
}
