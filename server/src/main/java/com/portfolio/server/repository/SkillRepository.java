package com.portfolio.server.repository;

import com.portfolio.server.entity.Skill;
import com.portfolio.server.enums.SkillCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SkillRepository extends JpaRepository<Skill, Long> {
    List<Skill> findByCategoryOrderByOrderIndexAsc(SkillCategory category);
}
