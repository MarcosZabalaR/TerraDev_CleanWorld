package com.cleanworld.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.sql.Timestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "clean_up_event")
@Getter @Setter
public class EventEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    private String description;

    @Column(nullable = false)
    private LocalDateTime datetime;

    @Column(insertable = false, updatable = false)
    private Timestamp created_at;

    @Column(insertable = false, updatable = false)
    private Timestamp updated_at;

    private String status;

    private Integer reward_points;

    // MANY events → ONE zone
    @ManyToOne
    @JoinColumn(name = "zone_id", nullable = true)
    private ZoneEntity zone;

    // Event has many attendees
    @ManyToMany
    @JoinTable(
            name = "event_attendees",
            joinColumns = @JoinColumn(name = "event_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    private List<UserEntity> attendees;
}
