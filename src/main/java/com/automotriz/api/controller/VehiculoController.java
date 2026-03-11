package com.automotriz.api.controller;

import com.automotriz.api.dto.VehiculoDTO;
import com.automotriz.api.entity.Agencia;
import com.automotriz.api.entity.Vehiculo;
import com.automotriz.api.entity.Version;
import com.automotriz.api.repository.AgenciaRepository;
import com.automotriz.api.repository.VehiculoRepository;
import com.automotriz.api.repository.VersionRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/vehiculos")
public class VehiculoController {

    private final VehiculoRepository vehiculoRepository;
    private final VersionRepository versionRepository;
    private final AgenciaRepository agenciaRepository;

    public VehiculoController(VehiculoRepository vehiculoRepository, VersionRepository versionRepository, AgenciaRepository agenciaRepository) {
        this.vehiculoRepository = vehiculoRepository;
        this.versionRepository = versionRepository;
        this.agenciaRepository = agenciaRepository;
    }

    @GetMapping
    public List<Vehiculo> obtenerTodos() {
        return vehiculoRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<?> crearVehiculo(@Valid @RequestBody VehiculoDTO dto) {
        Optional<Version> versionOpt = versionRepository.findById(dto.getVersionId());
        if (versionOpt.isEmpty()) {
            return new ResponseEntity<>("La versión especificada no existe", HttpStatus.BAD_REQUEST);
        }

        Optional<Agencia> agenciaOpt = agenciaRepository.findById(dto.getAgenciaId());
        if (agenciaOpt.isEmpty()) {
            return new ResponseEntity<>("La agencia especificada no existe", HttpStatus.BAD_REQUEST);
        }

        Vehiculo vehiculo = new Vehiculo();
        mapearDtoAEntidad(dto, vehiculo, versionOpt.get(), agenciaOpt.get());
        return new ResponseEntity<>(vehiculoRepository.save(vehiculo), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizarVehiculo(@PathVariable Long id, @Valid @RequestBody VehiculoDTO dto) {
        Optional<Vehiculo> vehiculoOpt = vehiculoRepository.findById(id);
        if (vehiculoOpt.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        Optional<Version> versionOpt = versionRepository.findById(dto.getVersionId());
        if (versionOpt.isEmpty()) {
            return new ResponseEntity<>("La versión especificada no existe", HttpStatus.BAD_REQUEST);
        }

        Optional<Agencia> agenciaOpt = agenciaRepository.findById(dto.getAgenciaId());
        if (agenciaOpt.isEmpty()) {
            return new ResponseEntity<>("La agencia especificada no existe", HttpStatus.BAD_REQUEST);
        }

        Vehiculo vehiculo = vehiculoOpt.get();
        mapearDtoAEntidad(dto, vehiculo, versionOpt.get(), agenciaOpt.get());
        return new ResponseEntity<>(vehiculoRepository.save(vehiculo), HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarVehiculo(@PathVariable Long id) {
        if (vehiculoRepository.existsById(id)) {
            vehiculoRepository.deleteById(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    private void mapearDtoAEntidad(VehiculoDTO dto, Vehiculo vehiculo, Version version, Agencia agencia) {
        vehiculo.setVin(dto.getVin());
        vehiculo.setColorEspecifico(dto.getColorEspecifico());
        vehiculo.setEstado(dto.getEstado());
        vehiculo.setPrecioVentaEspecificoUsd(dto.getPrecioVentaEspecificoUsd());
        vehiculo.setPrecioVentaEspecificoVes(dto.getPrecioVentaEspecificoVes());
        vehiculo.setPrecioAlquilerEspecificoUsd(dto.getPrecioAlquilerEspecificoUsd());
        vehiculo.setPrecioAlquilerEspecificoVes(dto.getPrecioAlquilerEspecificoVes());
        vehiculo.setFechaVenta(dto.getFechaVenta());
        vehiculo.setFechaAlquiler(dto.getFechaAlquiler());
        vehiculo.setVersion(version);
        vehiculo.setAgencia(agencia);
    }
}