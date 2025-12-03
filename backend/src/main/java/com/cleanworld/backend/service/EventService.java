package com.cleanworld.backend.service;

import com.cleanworld.backend.entity.EventEntity;
import com.cleanworld.backend.repository.EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Optional;

@Service
public class EventService {

    @Autowired
    private EventRepository eventRepository;

    /**
     * GET -> Obtener todos los eventos
     *
     * @return Lista de todos los eventos de la BBDD
     */
    public ArrayList<EventEntity> getEvents() {
        return (ArrayList<EventEntity>) eventRepository.findAll();
    }

    /**
     * GET -> Obtener un evento por ID
     *
     * @param id Identificador del evento
     * @return Optional con el evento indicado por ID de la BBDD
     */
    public Optional<EventEntity> getEvent(Long id) {
        return eventRepository.findById(id);
    }

    /**
     * POST -> Crear un nuevo evento
     *
     * @param event Entidad EventEntity con los datos a guardar
     * @return Evento creado en la BBDD
     */
    public EventEntity createEvent(EventEntity event) {
        return eventRepository.save(event);
    }

    /**
     * PUT -> Actualizar completamente un evento
     *
     * @param id Identificador del evento a actualizar
     * @param updatedEvent Evento con los nuevos datos
     * @return Evento actualizado
     * @throws RuntimeException si el evento no existe
     */
    public EventEntity updateEvent(Long id, EventEntity updatedEvent) {
        return eventRepository.findById(id).map(event -> {
            event.setTitle(updatedEvent.getTitle());
            event.setDescription(updatedEvent.getDescription());
            event.setDatetime(updatedEvent.getDatetime());
            event.setStatus(updatedEvent.getStatus());
            event.setReward_points(updatedEvent.getReward_points());
            event.setZone(updatedEvent.getZone());
            return eventRepository.save(event);
        }).orElseThrow(() -> new RuntimeException("Evento no encontrado con id " + id));
    }

    /**
     * PATCH -> Actualizar parcialmente un evento
     *
     * @param id Identificador del evento a actualizar
     * @param partialEvent Evento con los campos que se desean actualizar (los nulos se ignoran)
     * @return Evento actualizado
     * @throws RuntimeException si el evento no existe
     */
    public EventEntity patchEvent(Long id, EventEntity partialEvent) {
        return eventRepository.findById(id).map(event -> {
            if (partialEvent.getTitle() != null) event.setTitle(partialEvent.getTitle());
            if (partialEvent.getDescription() != null) event.setDescription(partialEvent.getDescription());
            if (partialEvent.getDatetime() != null) event.setDatetime(partialEvent.getDatetime());
            if (partialEvent.getStatus() != null) event.setStatus(partialEvent.getStatus());
            if (partialEvent.getReward_points() != null) event.setReward_points(partialEvent.getReward_points());
            if (partialEvent.getZone() != null) event.setZone(partialEvent.getZone());
            return eventRepository.save(event);
        }).orElseThrow(() -> new RuntimeException("Evento no encontrado con id " + id));
    }

    /**
     * DELETE -> Eliminar un evento
     *
     * @param id Identificador del evento a eliminar
     * @throws RuntimeException si el evento no existe
     */
    public void deleteEvent(Long id) {
        if (!eventRepository.existsById(id)) {
            throw new RuntimeException("Evento no encontrado con id " + id);
        }
        eventRepository.deleteById(id);
    }
}
