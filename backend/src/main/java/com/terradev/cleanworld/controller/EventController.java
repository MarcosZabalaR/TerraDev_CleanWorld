package com.terradev.cleanworld.controller;

import com.terradev.cleanworld.entity.EventEntity;
import com.terradev.cleanworld.service.EventService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/events")
public class EventController {
    @Autowired
    EventService eventService;

    /**
     * GET -> Obtener todos los eventos
     */
    @GetMapping()
    public ArrayList<EventEntity> getEvents() {
        return eventService.getEvents();
    }

    /**
     * GET -> Obtener un evento por ID
     */
    @GetMapping("/{id}")
    public EventEntity getEvent(@PathVariable Long id) {
        return eventService.getEvent(id)
                .orElseThrow(() -> new RuntimeException("Evento no encontrado con id " + id));
    }

    /**
     * POST -> Crear un nuevo evento
     */
    @PostMapping
    public EventEntity createEvent(@RequestBody EventEntity event) {
        return eventService.createEvent(event);
    }

    /**
     * PUT -> Actualizar completamente un evento
     */
    @PutMapping("/{id}")
    public EventEntity updateEvent(@PathVariable Long id, @RequestBody EventEntity updatedEvent) {
        return eventService.updateEvent(id, updatedEvent);
    }

    /**
     * PATCH -> Actualizar parcialmente un evento
     */
    @PatchMapping("/{id}")
    public EventEntity patchEvent(@PathVariable Long id, @RequestBody EventEntity partialEvent) {
        return eventService.patchEvent(id, partialEvent);
    }

    /**
     * DELETE -> Eliminar un evento
     */
    @DeleteMapping("/{id}")
    public void deleteEvent(@PathVariable Long id) {
        eventService.deleteEvent(id);
    }
}
