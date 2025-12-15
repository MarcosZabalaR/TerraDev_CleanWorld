package com.terradev.cleanworld.dto;

import lombok.Getter;
import lombok.Setter;

import java.sql.Timestamp;

@Getter @Setter
public class ZoneDto {
    private Long id;
    private Double latitude;
    private Double longitude;
    private String title;
    private String description;
    private String img_url;
    private String after_img_url;
    private Integer severity;
    private String status;
    private Timestamp createdAt;
}
