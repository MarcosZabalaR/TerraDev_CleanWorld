package com.terradev.cleanWorld.service;

import com.terradev.cleanWorld.entity.UserEntity;
import com.terradev.cleanWorld.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

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

    public void deleteById(Long id) {
        repository.deleteById(id);
    }
}
