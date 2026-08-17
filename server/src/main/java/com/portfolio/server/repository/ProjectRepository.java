package com.portfolio.server.repository;

import com.portfolio.server.entity.Project;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {
    @EntityGraph(attributePaths = {"projectUrls", "skills"})
    List<Project> findAllByOrderByOrderIndexAsc();
}
