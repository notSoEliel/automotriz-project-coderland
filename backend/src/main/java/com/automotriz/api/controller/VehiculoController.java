package com.automotriz.api.controller;

import com.automotriz.api.dto.VehiculoDTO;
import com.automotriz.api.entity.Agencia;
import com.automotriz.api.entity.Vehiculo;
import com.automotriz.api.entity.Version;
import com.automotriz.api.entity.VehiculoMultimedia;
import com.automotriz.api.repository.AgenciaRepository;
import com.automotriz.api.repository.VehiculoRepository;
import com.automotriz.api.repository.VersionRepository;
import com.automotriz.api.repository.VehiculoMultimediaRepository;
import com.automotriz.api.service.FileStorageService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.Random;

@RestController
@RequestMapping("/api/vehiculos")
public class VehiculoController {

    private final VehiculoRepository vehiculoRepository;
    private final VersionRepository versionRepository;
    private final AgenciaRepository agenciaRepository;
    private final VehiculoMultimediaRepository vehiculoMultimediaRepository;
    private final FileStorageService fileStorageService;

    public VehiculoController(VehiculoRepository vehiculoRepository, VersionRepository versionRepository, AgenciaRepository agenciaRepository, VehiculoMultimediaRepository vehiculoMultimediaRepository, FileStorageService fileStorageService) {
        this.vehiculoRepository = vehiculoRepository;
        this.versionRepository = versionRepository;
        this.agenciaRepository = agenciaRepository;
        this.vehiculoMultimediaRepository = vehiculoMultimediaRepository;
        this.fileStorageService = fileStorageService;
    }

    @GetMapping
    public Page<Vehiculo> obtenerTodos(
            @RequestParam(required = false) Long agenciaId,
            @RequestParam(required = false) Vehiculo.EstadoVehiculo estado,
            @RequestParam(required = false) Long marcaId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Pageable pageable = PageRequest.of(page, size);
        
        if (agenciaId != null || estado != null || marcaId != null) {
            return vehiculoRepository.findByFiltros(agenciaId, estado, marcaId, pageable);
        }
        return vehiculoRepository.findAll(pageable);
    }

    @GetMapping("/generar-placa")
    public ResponseEntity<?> generarPlaca() {
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        String nums = "0123456789";
        Random random = new Random();
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < 3; i++) {
            sb.append(chars.charAt(random.nextInt(chars.length())));
        }
        sb.append("-");
        for (int i = 0; i < 3; i++) {
            sb.append(nums.charAt(random.nextInt(nums.length())));
        }
        return new ResponseEntity<>(Collections.singletonMap("placa", sb.toString()), HttpStatus.OK);
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
        Optional<Vehiculo> vehiculoOpt = vehiculoRepository.findById(id);
        if (vehiculoOpt.isPresent()) {
            Vehiculo vehiculo = vehiculoOpt.get();
            // Limpiar archivos multimedia físicos antes de borrar
            if (vehiculo.getGalerias() != null && !vehiculo.getGalerias().isEmpty()) {
                for (VehiculoMultimedia multimedia : vehiculo.getGalerias()) {
                    try {
                        fileStorageService.borrarArchivo(multimedia.getRutaArchivo());
                    } catch (Exception e) {
                        System.err.println("Error eliminando imagen de vehículo: " + e.getMessage());
                    }
                }
            }
            vehiculoRepository.deleteById(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @PostMapping("/{id}/multimedia")
    public ResponseEntity<?> subirFotoVehiculo(@PathVariable Long id, @RequestParam("file") MultipartFile file) {
        Optional<Vehiculo> vehiculoOpt = vehiculoRepository.findById(id);
        if (vehiculoOpt.isEmpty()) {
            return new ResponseEntity<>("El vehículo especificado no existe", HttpStatus.NOT_FOUND);
        }

        try {
            String rutaWebp = fileStorageService.guardarImagenWebp(file);
            Vehiculo vehiculo = vehiculoOpt.get();

            VehiculoMultimedia multimedia = new VehiculoMultimedia();
            multimedia.setRutaArchivo(rutaWebp);
            multimedia.setNombreArchivo(file.getOriginalFilename());
            multimedia.setTipoArchivo("image/webp");
            multimedia.setFechaSubida(LocalDateTime.now());
            multimedia.setVehiculo(vehiculo);
            
            VehiculoMultimedia saved = vehiculoMultimediaRepository.save(multimedia);
            return new ResponseEntity<>(saved, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>("Error al guardar la foto del vehículo", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/multimedia/{multimediaId}")
    public ResponseEntity<Void> eliminarFotoVehiculo(@PathVariable Long multimediaId) {
        Optional<VehiculoMultimedia> multimediaOpt = vehiculoMultimediaRepository.findById(multimediaId);
        if (multimediaOpt.isPresent()) {
            VehiculoMultimedia multimedia = multimediaOpt.get();
            try {
                fileStorageService.borrarArchivo(multimedia.getRutaArchivo());
            } catch (Exception e) {
                System.err.println("Error al borrar archivo físico de vehículo: " + e.getMessage());
            }
            vehiculoMultimediaRepository.deleteById(multimediaId);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    private void mapearDtoAEntidad(VehiculoDTO dto, Vehiculo vehiculo, Version version, Agencia agencia) {
        vehiculo.setPlaca(dto.getPlaca());
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