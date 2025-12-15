package com.terradev.cleanworld.dto;


import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class CreateZoneDto {
    private Double latitude;
    private Double longitude;
    private String title;
    private String description;
    private String img_url;
    private Integer severity;
}
