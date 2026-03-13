package com.automotriz.api.repository;

import com.automotriz.api.entity.VehiculoMultimedia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VehiculoMultimediaRepository extends JpaRepository<VehiculoMultimedia, Long> {
    List<VehiculoMultimedia> findByVehiculoId(Long vehiculoId);
}
