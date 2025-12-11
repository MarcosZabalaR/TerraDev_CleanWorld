package com.terradev.cleanworld.controller;

import com.terradev.cleanworld.entity.ZoneEntity;
import com.terradev.cleanworld.service.ZoneService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/zones")
public class ZoneController {

    private final ZoneService service;

    public ZoneController(ZoneService service) {
        this.service = service;
    }

    /**
     * GET -> Obtener todas las zonas
     */
    @GetMapping
    public List<ZoneEntity> getAll() {
        return service.findAll();
    }

    /**
     * GET -> Obtener una zona por ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<ZoneEntity> getById(@PathVariable Long id) {
        return service.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * POST -> Crear una nueva zona
     */
    @PostMapping
    public ZoneEntity create(@RequestBody ZoneEntity z) {
        return service.save(z);
    }

    /**
     * PATCH -> Actualizar parcialmente una zona
     */
    @PatchMapping("/edit/{id}")
    public ResponseEntity<ZoneEntity> update(@PathVariable Long id, @RequestBody Map<String, Object> update) {
        return service.patchZone(id, update)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * PUT -> Actualizar completamente una zona
     */
    @PutMapping("/{id}")
    public ResponseEntity<ZoneEntity> update(@PathVariable Long id, @RequestBody ZoneEntity z) {
        return service.findById(id)
                .map(existing -> {
                    existing.setLatitude(z.getLatitude());
                    existing.setLongitude(z.getLongitude());
                    existing.setTitle(z.getTitle());
                    existing.setDescription(z.getDescription());
                    existing.setImg_url(z.getImg_url());
                    existing.setAfter_img_url(z.getAfter_img_url());
                    existing.setSeverity(z.getSeverity());
                    existing.setStatus(z.getStatus());
                    return ResponseEntity.ok(service.save(existing));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * DELETE -> Eliminar una zona
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        return service.findById(id)
                .map(n -> {
                    service.deteleById(id);
                    return ResponseEntity.ok().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
