package com.portfolio.server.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "personal_info")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PersonalInfo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(name = "title_vi", nullable = false)
    private String titleVi;

    @Column(name = "title_en", nullable = false)
    private String titleEn;

    @Column(name = "summary_vi", nullable = false, columnDefinition = "TEXT")
    private String summaryVi;

    @Column(name = "summary_en", nullable = false, columnDefinition = "TEXT")
    private String summaryEn;

    @Column(nullable = false, length = 100)
    private String email;

    @Column(nullable = false, length = 20)
    private String phone;

    @Column(name = "location_vi", nullable = false, length = 150)
    private String locationVi;

    @Column(name = "location_en", nullable = false, length = 150)
    private String locationEn;

    @Column(name = "linkedin_url")
    private String linkedinUrl;

    @Column(name = "github_url")
    private String githubUrl;

    @Column(name = "avatar_url")
    private String avatarUrl;

    @Column(name = "cv_url")
    private String cvUrl;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
