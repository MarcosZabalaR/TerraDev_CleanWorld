package com.terradev.cleanWorld.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "user")
@Getter @Setter
public class UserEntity {

    private String name;

    @Column(unique = true)
    private String email;

    private String password;

    private String avatar;

    private Integer points = 0;
}
