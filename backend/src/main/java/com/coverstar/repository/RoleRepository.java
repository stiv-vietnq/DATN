package com.coverstar.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.coverstar.entity.Role;

public interface RoleRepository extends JpaRepository<Role, Long>{}