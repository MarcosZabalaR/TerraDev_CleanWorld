package com.terradev.cleanworld.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

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

    private Integer rol = 0; // 0 = GUEST, 1 = USER, 2 = ADMIN

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private Timestamp createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private Timestamp updatedAt;

    @OneToMany(mappedBy = "reportedUser", fetch = FetchType.LAZY)
    private List<ZoneEntity> reportedZones = new ArrayList<>();

    public String getRoleName() {
        return switch (rol) {
            case 1 -> "ROLE_USER";
            case 2 -> "ROLE_ADMIN";
            default -> "ROLE_GUEST";
        };
    }
}