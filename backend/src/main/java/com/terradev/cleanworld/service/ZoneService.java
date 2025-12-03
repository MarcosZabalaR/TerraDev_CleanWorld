package com.terradev.cleanworld.service;

import com.terradev.cleanworld.entity.ZoneEntity;
import com.terradev.cleanworld.repository.ZoneRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class ZoneService {

    private final ZoneRepository repository;

    public ZoneService(ZoneRepository repository) {
        this.repository = repository;
    }

    public List<ZoneEntity> findAll() {
        return repository.findAll();
    }

    public Optional<ZoneEntity> findById(Long id) {
        return repository.findById(id);
    }

    public ZoneEntity save(ZoneEntity z) {
        return repository.save(z);
    }

    public Optional<ZoneEntity> patchZone(Long id, Map<String, Object> updates) {
        return repository.findById(id).map(existing -> {

            updates.forEach((key, value) -> {
                switch (key) {
                    case "title":
                        existing.setTitle((String) value);
                        break;
                    case "description":
                        existing.setDescription((String) value);
                        break;
                    case "img_url":
                        existing.setImg_url((String) value);
                        break;
                    case "after_img_url":
                        existing.setAfter_img_url((String) value);
                        break;
                    case "severity":
                        existing.setSeverity((Integer) value);
                        break;
                }
            });

            return repository.save(existing);
        });
    }

    public void deteleById(Long id) {
        repository.deleteById(id);
    }
}
