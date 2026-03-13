package com.automotriz.api.repository;

import com.automotriz.api.entity.Vehiculo;
import com.automotriz.api.entity.Vehiculo.EstadoVehiculo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VehiculoRepository extends JpaRepository<Vehiculo, Long> {

    @Query("SELECT v FROM Vehiculo v WHERE " +
           "(:agenciaId IS NULL OR v.agencia.id = :agenciaId) AND " +
           "(:estado IS NULL OR v.estado = :estado) AND " +
           "(:marcaId IS NULL OR v.version.modelo.marca.id = :marcaId)")
    List<Vehiculo> findByFiltros(@Param("agenciaId") Long agenciaId,
                                 @Param("estado") EstadoVehiculo estado,
                                 @Param("marcaId") Long marcaId);
}