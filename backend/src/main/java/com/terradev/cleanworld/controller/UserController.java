package com.terradev.cleanworld.controller;

import com.terradev.cleanworld.dto.LoginResponse;
import com.terradev.cleanworld.dto.UserDto;
import com.terradev.cleanworld.entity.UserEntity;
import com.terradev.cleanworld.service.UserService;
import com.terradev.cleanworld.util.JwtUtil;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/users")
public class UserController {

    private final UserService service;
    private final JwtUtil jwtUtil;

    public UserController(UserService service, JwtUtil jwtUtil) {
        this.service = service;
        this.jwtUtil = jwtUtil;
    }

    /**
     * GET -> Obtener todos los usuarios
     */
    @GetMapping
    public List<UserEntity> getAll() {
        return  service.findAll();
    }

    /**
     * GET -> Obtener un usuario por ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<UserEntity> getById(@PathVariable Long id) {
        return service.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * GET -> Comprobar si un email existe
     */
    @GetMapping("/check-email")
    public Map<String, Boolean> checkEmail(@RequestParam String email) {
        boolean exists = service.existsByEmail(email);
        return Map.of("exists", exists);
    }

    /**
     * GET -> Comprobar si el usuario existe
     */
    @GetMapping("/check-user")
    public Map<String, Boolean> checkUser(@RequestParam String name) {
        boolean exists = service.existsByName(name);
        return Map.of("exists", exists);
    }

    /**
     * POST -> Crear un nuevo usuario
     */
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody UserDto userDto) {
        boolean valid = service.validateUser(userDto.getEmail(), userDto.getPassword());

        if (valid) {
            UserEntity user = service.findByEmail(userDto.getEmail()).get();
            String token = jwtUtil.generateToken(user.getEmail());

            LoginResponse response = new LoginResponse(
                    user.getId(),
                    user.getName(),
                    user.getEmail(),
                    token
            );

            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    /**
     * POST -> Registrar un nuevo usuario
     */
    @PostMapping
    public ResponseEntity<LoginResponse> register(@RequestBody UserEntity user) {
        // Validaciones de email y nombre
        if (service.existsByEmail(user.getEmail()) || service.existsByName(user.getName())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }

        // Guardar usuario
        UserEntity saved = service.save(user);

        // Crear respuesta sin contraseña
        LoginResponse response = new LoginResponse(
                saved.getId(),
                saved.getName(),
                saved.getEmail(),
                null // Token null por ahora
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * PATCH -> Actualizar parcialmente un usuario
     */
    @PatchMapping("/edit/{id}")
    public ResponseEntity<UserEntity> update(@PathVariable Long id, @RequestBody Map<String, Object> update) {
        return service.patchUser(id, update)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * PUT -> Actualizar completamente un usuario
     */
    @PutMapping("/{id}")
    public ResponseEntity<UserEntity> updateAll(@PathVariable Long id, @RequestBody UserEntity u) {
        return service.findById(id)
                .map(existing -> {
                    existing.setName(u.getName());
                    existing.setEmail(u.getEmail());
                    existing.setAvatar(u.getAvatar());
                    existing.setPoints(u.getPoints());
                    existing.setPassword(u.getPassword());
                    existing.setRol(u.getRol());
                    return ResponseEntity.ok(service.save(existing));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * DELETE -> Eliminar un usuario
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        return service.findById(id)
                .map(n -> {
                    service.deleteById(id);
                    return ResponseEntity.ok().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}