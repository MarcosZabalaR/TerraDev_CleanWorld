package com.terradev.cleanworld.service;

import com.terradev.cleanworld.entity.UserEntity;
import com.terradev.cleanworld.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository repository;

    public UserService(UserRepository repository) {
        this.repository = repository;
    }

    /**
     * GET -> Obtener todos los usuarios
     *
     * @return Lista de todos los usuarios
     */
    public List<UserEntity> findAll() {
        return repository.findAll();
    }

    /**
     * GET -> Obtener un usuario por ID
     *
     * @param id Identificador del usuario
     * @return Optional con el usuario indicado por ID
     */
    public Optional<UserEntity> findById(Long id) {
        return repository.findById(id);
    }

    /**
     * POST -> Crear un nuevo usuario
     *
     * @param u Entidad UserEntity con los datos a guardar
     * @return Usario creado
     */
    public UserEntity save(UserEntity u) {
        return repository.save(u);
    }

    /**
     * PATCH -> Actualizar parcialmente un usuario
     *
     * @param id Identificador del usuario
     * @param updates Campos que se desean actualizar
     * @return Usuario actualizado
     */
    public Optional<UserEntity> patchUser(Long id, Map<String, Object> updates) {
        return repository.findById(id).map(existing -> {

            updates.forEach((key, value) -> {
                switch (key) {
                    case "name":
                        existing.setName((String) value);
                        break;
                    case "email":
                        existing.setEmail((String) value);
                        break;
                    case "password":
                        existing.setPassword((String) value);
                        break;
                    case "avatar":
                        existing.setAvatar((String) value);
                        break;
                    case "points":
                        existing.setPoints((Integer) value);
                        break;
                    case "rol":
                        existing.setRol((Integer) value);
                        break;
                }
            });

            return repository.save(existing);
        });
    }

    /**
     * DELETE -> Eliminar usuario
     *
     * @param id Identificador del usuario a eliminar
     * @throws RuntimeException Si el usuario no existe
     */
    public void deleteById(Long id) {
        if (!repository.existsById(id)) {
            throw new RuntimeException("Usuario no encontrado con id " + id);
        }
        repository.deleteById(id);
    }
}
