package com.portfolio.server.entity;

import com.portfolio.server.enums.SkillCategory;
import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "skills")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = "projects")
@EqualsAndHashCode(exclude = "projects")
public class Skill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 50)
    private String title;

    @Column(name = "icon_class", nullable = false, length = 100)
    private String iconClass;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SkillCategory category;

    @Column(name = "order_index", nullable = false)
    private Integer orderIndex = 0;

    @ManyToMany(mappedBy = "skills")
    private Set<Project> projects = new HashSet<>();
}
