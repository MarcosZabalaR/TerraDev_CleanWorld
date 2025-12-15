package com.terradev.cleanworld.mapper;


import com.terradev.cleanworld.dto.CreateZoneDto;
import com.terradev.cleanworld.dto.ZoneDto;
import com.terradev.cleanworld.entity.ZoneEntity;
import org.springframework.stereotype.Component;

@Component
public class ZoneMapper {

    public ZoneDto toDto(ZoneEntity entity) {
        ZoneDto dto = new ZoneDto();
        dto.setId(entity.getId());
        dto.setLatitude(entity.getLatitude());
        dto.setLongitude(entity.getLongitude());
        dto.setTitle(entity.getTitle());
        dto.setDescription(entity.getDescription());
        dto.setImg_url(entity.getImg_url());
        dto.setAfter_img_url(entity.getAfter_img_url());
        dto.setSeverity(entity.getSeverity());
        dto.setStatus(entity.getStatus());
        dto.setCreatedAt(entity.getCreatedAt());
        return dto;
    }

    public ZoneEntity toEntity(CreateZoneDto dto) {
        ZoneEntity entity = new ZoneEntity();
        entity.setLatitude(dto.getLatitude());
        entity.setLongitude(dto.getLongitude());
        entity.setTitle(dto.getTitle());
        entity.setDescription(dto.getDescription());
        entity.setImg_url(dto.getImg_url());
        entity.setSeverity(dto.getSeverity());
        return entity;
    }
}
