package com.terradev.cleanworld.controller;

import com.terradev.cleanworld.entity.UserEntity;
import com.terradev.cleanworld.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/users")
public class UserController {
    
    private final UserService service;

    public UserController(UserService service) {
        this.service = service;
    }
    
    @GetMapping
    public List<UserEntity> getAll() {
        return  service.findAll();
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<UserEntity> getById(@PathVariable Long id) {
        return service.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping
    public UserEntity create(@RequestBody UserEntity u) {
        return service.save(u);
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
