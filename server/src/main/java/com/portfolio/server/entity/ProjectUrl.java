package com.portfolio.server.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "project_urls")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = "project")
@EqualsAndHashCode(exclude = "project")
public class ProjectUrl {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    @Column(nullable = false)
    private String url;

    @Column(name = "label_vi", nullable = false, length = 50)
    private String labelVi;

    @Column(name = "label_en", nullable = false, length = 50)
    private String labelEn;
}
