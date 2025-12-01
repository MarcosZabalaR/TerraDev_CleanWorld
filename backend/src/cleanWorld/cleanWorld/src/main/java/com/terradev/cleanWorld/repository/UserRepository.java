package com.terradev.cleanWorld.repository;

import com.terradev.cleanWorld.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<UserEntity, Long> {
}
