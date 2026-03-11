package com.automotriz.api.repository;

import com.automotriz.api.entity.Agencia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AgenciaRepository extends JpaRepository<Agencia, Long> {
    // Con solo heredar de JpaRepository, Spring Boot ya nos regala
    // todos los métodos mágicos (save, findAll, findById, delete)
}