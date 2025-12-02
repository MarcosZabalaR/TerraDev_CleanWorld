package com.terradev.cleanWorld.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "zone")
@Getter @Setter

public class ZoneEntity {

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

}
