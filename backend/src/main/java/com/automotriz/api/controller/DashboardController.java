package com.automotriz.api.controller;

import com.automotriz.api.dto.DashboardStatsDTO;
import com.automotriz.api.entity.Vehiculo.EstadoVehiculo;
import com.automotriz.api.repository.AgenciaRepository;
import com.automotriz.api.repository.VehiculoRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final VehiculoRepository vehiculoRepository;
    private final AgenciaRepository agenciaRepository;

    public DashboardController(VehiculoRepository vehiculoRepository, AgenciaRepository agenciaRepository) {
        this.vehiculoRepository = vehiculoRepository;
        this.agenciaRepository = agenciaRepository;
    }

    @GetMapping("/stats")
    public ResponseEntity<DashboardStatsDTO> obtenerStats() {
        DashboardStatsDTO stats = new DashboardStatsDTO(
                vehiculoRepository.count(),
                vehiculoRepository.countByEstado(EstadoVehiculo.DISPONIBLE),
                vehiculoRepository.countByEstado(EstadoVehiculo.VENDIDO),
                agenciaRepository.count()
        );
        return ResponseEntity.ok(stats);
    }
}
