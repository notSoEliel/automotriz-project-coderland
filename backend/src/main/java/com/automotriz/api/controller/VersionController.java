package com.automotriz.api.controller;

import com.automotriz.api.dto.VersionDTO;
import com.automotriz.api.entity.Modelo;
import com.automotriz.api.entity.Version;
import com.automotriz.api.repository.ModeloRepository;
import com.automotriz.api.repository.VersionRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/versiones")
public class VersionController {

    private final VersionRepository versionRepository;
    private final ModeloRepository modeloRepository;

    public VersionController(VersionRepository versionRepository, ModeloRepository modeloRepository) {
        this.versionRepository = versionRepository;
        this.modeloRepository = modeloRepository;
    }

    @GetMapping
    public List<Version> obtenerTodas() {
        return versionRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<?> crearVersion(@Valid @RequestBody VersionDTO dto) {
        Optional<Modelo> modeloOpt = modeloRepository.findById(dto.getModeloId());
        if (modeloOpt.isEmpty()) {
            return new ResponseEntity<>("El modelo especificado no existe", HttpStatus.BAD_REQUEST);
        }

        Version version = new Version();
        mapearDtoAEntidad(dto, version, modeloOpt.get());
        return new ResponseEntity<>(versionRepository.save(version), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizarVersion(@PathVariable Long id, @Valid @RequestBody VersionDTO dto) {
        Optional<Version> versionOpt = versionRepository.findById(id);
        if (versionOpt.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        Optional<Modelo> modeloOpt = modeloRepository.findById(dto.getModeloId());
        if (modeloOpt.isEmpty()) {
            return new ResponseEntity<>("El modelo especificado no existe", HttpStatus.BAD_REQUEST);
        }

        Version version = versionOpt.get();
        mapearDtoAEntidad(dto, version, modeloOpt.get());
        return new ResponseEntity<>(versionRepository.save(version), HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarVersion(@PathVariable Long id) {
        if (versionRepository.existsById(id)) {
            versionRepository.deleteById(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    private void mapearDtoAEntidad(VersionDTO dto, Version version, Modelo modelo) {
        version.setTitulo(dto.getTitulo());
        version.setDescripcion(dto.getDescripcion());
        version.setAno(dto.getAno());
        version.setMotor(dto.getMotor());
        version.setCilindrada(dto.getCilindrada());
        version.setColoresDisponibles(dto.getColoresDisponibles());
        version.setPrecioVentaBaseUsd(dto.getPrecioVentaBaseUsd());
        version.setPrecioVentaBaseVes(dto.getPrecioVentaBaseVes());
        version.setPrecioAlquilerBaseUsd(dto.getPrecioAlquilerBaseUsd());
        version.setPrecioAlquilerBaseVes(dto.getPrecioAlquilerBaseVes());
        version.setModelo(modelo);
    }
}