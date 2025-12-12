package com.terradev.cleanworld.repository;

import com.terradev.cleanworld.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<UserEntity, Long> {
    boolean existsByEmail(String email);
    boolean existsByName(String name);
    Optional<UserEntity> findByEmail(String email);
}
