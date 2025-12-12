package com.terradev.cleanworld.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "user")
@Getter @Setter
public class UserEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    private String avatar;

    private Integer points = 0;

    private Integer rol = 0;

    @Column(insertable = false, updatable = false)
    private Timestamp created_at;

    @Column(insertable = false, updatable = false)
    private Timestamp updated_at;

    @OneToMany(mappedBy = "reportedUser", fetch = FetchType.LAZY)
    private List<ZoneEntity> reportedZones = new ArrayList<>();
}
