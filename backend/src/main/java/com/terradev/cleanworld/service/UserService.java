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

    public List<UserEntity> findAll() {
        return repository.findAll();
    }

    public Optional<UserEntity> findById(Long id) {
        return repository.findById(id);
    }

    public UserEntity save(UserEntity u) {
        return repository.save(u);
    }

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
                }
            });

            return repository.save(existing);
        });
    }

    public void deleteById(Long id) {
        repository.deleteById(id);
    }
}
