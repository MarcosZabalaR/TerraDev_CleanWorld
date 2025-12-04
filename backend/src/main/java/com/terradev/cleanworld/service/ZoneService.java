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

    /**
     * GET -> Obtener todas las zonas
     *
     * @return Lista de todas las zonas
     */
    public List<ZoneEntity> findAll() {
        return repository.findAll();
    }

    /**
     * GET -> Obtener unazona por ID
     *
     * @param id Identificador de la zona
     * @return Optional con la zona indicado por ID
     */
    public Optional<ZoneEntity> findById(Long id) {
        return repository.findById(id);
    }

    /**
     * POST -> Crear una nueva zona
     *
     * @param z Entidad ZoneEntity con los datos a guardar
     * @return Zona Creada
     */
    public ZoneEntity save(ZoneEntity z) {
        return repository.save(z);
    }

    /**
     * PATCH -> Actualizar parcialmente una zona
     *
     * @param id Identificador de la zona
     * @param updates Campos que se desean actualizar
     * @return Zona actualizada
     */
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

    /**
     * DELETE -> Eliminar zona
     *
     * @param id Identificador de la zona a eliminar
     * @throws RuntimeException Si la zona no existe
     */
    public void deteleById(Long id) {
        if (!repository.existsById(id)) {
            throw new RuntimeException("Zona no encontrada con id " + id);
        }
        repository.deleteById(id);
    }
}
