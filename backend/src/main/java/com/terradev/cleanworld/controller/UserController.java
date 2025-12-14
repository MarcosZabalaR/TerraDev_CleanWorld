package com.terradev.cleanworld.controller;

import com.terradev.cleanworld.dto.LoginResponse;
import com.terradev.cleanworld.dto.UserDto;
import com.terradev.cleanworld.entity.UserEntity;
import com.terradev.cleanworld.service.UserService;
import com.terradev.cleanworld.config.JwtService; // <- Cambio aquí
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/users")
public class UserController {

    private final UserService service;
    private final JwtService jwtService; // <- Cambio aquí

    public UserController(UserService service, JwtService jwtService) {
        this.service = service;
        this.jwtService = jwtService; // <- Cambio aquí
    }

    @GetMapping
    public List<UserEntity> getAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserEntity> getById(@PathVariable Long id, Authentication auth) {
        var optionalUser = service.findById(id);

        if (optionalUser.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        UserEntity user = optionalUser.get();
        UserEntity loggedUser = (UserEntity) auth.getPrincipal();
        if (!user.getEmail().equals(loggedUser.getEmail()) && !loggedUser.getRoleName().equals("ADMIN")) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        return ResponseEntity.ok(user);
    }

    @GetMapping("/check-email")
    public Map<String, Boolean> checkEmail(@RequestParam String email) {
        boolean exists = service.existsByEmail(email);
        return Map.of("exists", exists);
    }

    @GetMapping("/check-user")
    public Map<String, Boolean> checkUser(@RequestParam String name) {
        boolean exists = service.existsByName(name);
        return Map.of("exists", exists);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody UserDto userDto) {
        boolean valid = service.validateUser(userDto.getEmail(), userDto.getPassword());

        if (valid) {
            UserEntity user = service.findByEmail(userDto.getEmail()).get();
            String token = jwtService.generateToken(user.getEmail()); // <- Cambio aquí

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

    @PostMapping
    public ResponseEntity<LoginResponse> register(@RequestBody UserEntity user) {
        if (service.existsByEmail(user.getEmail()) || service.existsByName(user.getName())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }

        UserEntity saved = service.save(user);

        LoginResponse response = new LoginResponse(
                saved.getId(),
                saved.getName(),
                saved.getEmail(),
                null // Token null por ahora
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PatchMapping("/edit/{id}")
    public ResponseEntity<UserEntity> update(@PathVariable Long id, @RequestBody Map<String, Object> update) {
        return service.patchUser(id, update)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

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
