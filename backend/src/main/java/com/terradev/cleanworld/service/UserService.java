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
     * GET -> Obtener el correo y comprobar si existe ya en la base de datos
     *
     * @param email Email del usuario a comprobar.
     * @return true si el email ya existe en la base de datos, false en caso contrario
     */
    public boolean existsByEmail(String email) {
        return repository.existsByEmail(email);
    }

    /**
     * GET -> Obtener el usuario y comprobar si existe ya en la base de datos
     *
     * @param name Nombre del usuario a comprobar.
     * @return true si el nombre ya existe en la base de datos, false en caso contrario.
     */
    public boolean existsByName(String name) {
        return repository.existsByName(name);
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
     * POST -> Valida si un usuario existe y si la contraseña es correcta
     *
     * @param email
     * @param password
     * @return
     */
    public boolean validateUser(String email, String password) {
        Optional<UserEntity> userOpt = repository.findByEmail(email);
        if (userOpt.isPresent()) {
            UserEntity user = userOpt.get();
            // Aquí hay usar hashing para la contraseña encriptada
            return user.getPassword().equals(password);
        }
        return false;
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
