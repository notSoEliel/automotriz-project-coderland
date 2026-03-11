package com.automotriz.api.repository;

import com.automotriz.api.entity.Multimedia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MultimediaRepository extends JpaRepository<Multimedia, Long> {
    List<Multimedia> findByVehiculoId(Long vehiculoId);
}