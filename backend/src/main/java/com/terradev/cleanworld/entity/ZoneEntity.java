package com.terradev.cleanworld.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.util.ArrayList;
import java.util.List;
import java.sql.Timestamp;

@Entity
@Table(name = "zone")
@Getter @Setter

public class ZoneEntity{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Double latitude;

    @Column(nullable = false)
    private Double longitude;

    @Column(nullable = false)
    private String title;

    private String description;

    private String img_url;

    private String after_img_url;

    @Column(nullable = false)
    private Integer severity;

    private String status;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private Timestamp createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private Timestamp updatedAt;

    // MANY zones -> ONE user
    @ManyToOne
    @JoinColumn(name = "reported_id", foreignKey = @ForeignKey(name = "fk_zone_reported_id"),nullable = true)
    private UserEntity reportedUser;

    // MANY events -> ONE zone
    @OneToMany(mappedBy = "zone", fetch = FetchType.LAZY)
    private List<EventEntity> zoneEvents = new ArrayList<>();
}
