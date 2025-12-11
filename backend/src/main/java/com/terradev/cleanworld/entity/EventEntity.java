package com.terradev.cleanworld.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.List;

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

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private Timestamp createdAt;
 
    @UpdateTimestamp
    @Column(name = "updated_at")
    private Timestamp updatedAt;

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
