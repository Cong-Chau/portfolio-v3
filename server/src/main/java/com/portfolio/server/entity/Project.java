package com.portfolio.server.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "projects")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = {"projectUrls", "skills"})
@EqualsAndHashCode(exclude = {"projectUrls", "skills"})
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "title_vi", nullable = false, length = 150)
    private String titleVi;

    @Column(name = "title_en", nullable = false, length = 150)
    private String titleEn;

    @Column(name = "complete_time_vi", nullable = false, length = 50)
    private String completeTimeVi;

    @Column(name = "complete_time_en", nullable = false, length = 50)
    private String completeTimeEn;

    @Column(name = "description_vi", nullable = false, columnDefinition = "TEXT")
    private String descriptionVi;

    @Column(name = "description_en", nullable = false, columnDefinition = "TEXT")
    private String descriptionEn;

    @Column(name = "highlight_vi", nullable = false, columnDefinition = "TEXT")
    private String highlightVi;

    @Column(name = "highlight_en", nullable = false, columnDefinition = "TEXT")
    private String highlightEn;

    @Column(name = "order_index", nullable = false)
    private Integer orderIndex = 0;

    @Column(name = "is_visible", nullable = false)
    @Builder.Default
    private Boolean isVisible = true;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<ProjectUrl> projectUrls = new HashSet<>();

    @ManyToMany
    @JoinTable(
            name = "project_skills",
            joinColumns = @JoinColumn(name = "project_id"),
            inverseJoinColumns = @JoinColumn(name = "skill_id")
    )
    private Set<Skill> skills = new HashSet<>();
}
