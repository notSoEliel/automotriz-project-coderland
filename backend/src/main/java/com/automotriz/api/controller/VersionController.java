package com.automotriz.api.controller;

import com.automotriz.api.dto.VersionDTO;
import com.automotriz.api.entity.Modelo;
import com.automotriz.api.entity.Version;
import com.automotriz.api.entity.VersionMultimedia;
import com.automotriz.api.repository.ModeloRepository;
import com.automotriz.api.repository.VersionMultimediaRepository;
import com.automotriz.api.repository.VersionRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.automotriz.api.service.FileStorageService;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/versiones")
public class VersionController {

    private final VersionRepository versionRepository;
    private final ModeloRepository modeloRepository;
    private final VersionMultimediaRepository versionMultimediaRepository;
    private final FileStorageService fileStorageService;

    public VersionController(VersionRepository versionRepository, ModeloRepository modeloRepository, VersionMultimediaRepository versionMultimediaRepository, FileStorageService fileStorageService) {
        this.versionRepository = versionRepository;
        this.modeloRepository = modeloRepository;
        this.versionMultimediaRepository = versionMultimediaRepository;
        this.fileStorageService = fileStorageService;
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

    @GetMapping("/modelo/{modeloId}")
    public ResponseEntity<List<Version>> obtenerVersionesPorModelo(@PathVariable Long modeloId) {
        List<Version> versiones = versionRepository.findByModeloId(modeloId);
        return new ResponseEntity<>(versiones, HttpStatus.OK);
    }

    @PostMapping("/{id}/foto")
    public ResponseEntity<?> subirFotoDefecto(@PathVariable Long id, @RequestParam("file") MultipartFile file) {
        Optional<Version> versionOpt = versionRepository.findById(id);
        if (versionOpt.isEmpty()) {
            return new ResponseEntity<>("La versión especificada no existe", HttpStatus.NOT_FOUND);
        }

        try {
            Version version = versionOpt.get();
            
            // Si ya hay una imagen de portada, intentar borrar el archivo físico anterior
            // SOLO SI esa imagen NO forma parte de la galería multimedia.
            if (version.getImagenDefecto() != null && !version.getImagenDefecto().isEmpty()) {
                boolean estaEnGaleria = false;
                if (version.getGalerias() != null) {
                     estaEnGaleria = version.getGalerias().stream()
                             .anyMatch(g -> g.getUrlArchivo().equals(version.getImagenDefecto()));
                }
                
                if (!estaEnGaleria) {
                    try {
                        fileStorageService.borrarArchivo(version.getImagenDefecto());
                    } catch (Exception e) {
                        System.err.println("Error al borrar portada anterior no referenciada: " + e.getMessage());
                    }
                }
            }

            String rutaWebp = fileStorageService.guardarImagenWebp(file);
            version.setImagenDefecto(rutaWebp);
            versionRepository.save(version);
            return new ResponseEntity<>(version, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>("Error al procesar la imagen de la versión", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/{id}/galeria")
    public ResponseEntity<?> subirFotoGaleria(@PathVariable Long id, @RequestParam("file") MultipartFile file) {
        Optional<Version> versionOpt = versionRepository.findById(id);
        if (versionOpt.isEmpty()) {
            return new ResponseEntity<>("La versión especificada no existe", HttpStatus.NOT_FOUND);
        }

        try {
            String rutaWebp = fileStorageService.guardarImagenWebp(file);
            Version version = versionOpt.get();

            VersionMultimedia multimedia = new VersionMultimedia();
            multimedia.setUrlArchivo(rutaWebp);
            multimedia.setVersion(version);
            
            VersionMultimedia saved = versionMultimediaRepository.save(multimedia);
            return new ResponseEntity<>(saved, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>("Error al procesar la imagen de la galería", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/galeria/{imagenId}")
    public ResponseEntity<Void> eliminarFotoGaleria(@PathVariable Long imagenId) {
        Optional<VersionMultimedia> multimediaOpt = versionMultimediaRepository.findById(imagenId);
        if (multimediaOpt.isPresent()) {
            VersionMultimedia multimedia = multimediaOpt.get();
            try {
                fileStorageService.borrarArchivo(multimedia.getUrlArchivo());
            } catch (Exception e) {
                // Loguear error pero igual eliminar la referencia de BD
                System.err.println("Error al borrar archivo físico: " + e.getMessage());
            }
            versionMultimediaRepository.deleteById(imagenId);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @PutMapping("/{id}/portada/{imagenId}")
    public ResponseEntity<?> establecerComoPortada(@PathVariable Long id, @PathVariable Long imagenId) {
        Optional<Version> versionOpt = versionRepository.findById(id);
        if (versionOpt.isEmpty()) {
            return new ResponseEntity<>("La versión especificada no existe", HttpStatus.NOT_FOUND);
        }

        Optional<VersionMultimedia> multimediaOpt = versionMultimediaRepository.findById(imagenId);
        if (multimediaOpt.isEmpty()) {
            return new ResponseEntity<>("La imagen de galería especificada no existe", HttpStatus.NOT_FOUND);
        }

        Version version = versionOpt.get();
        VersionMultimedia multimedia = multimediaOpt.get();

        // Validar que la imagen pertenece a la versión
        if (!multimedia.getVersion().getId().equals(version.getId())) {
            return new ResponseEntity<>("La imagen no pertenece a esta versión", HttpStatus.BAD_REQUEST);
        }

        // Según los requerimientos: Al establecer como portada desde la galería,
        // no eliminamos la portada anterior física ni de la BD. 
        // Simplemente copiamos la URL de la imagen de la galería a la propiedad defecto.
        version.setImagenDefecto(multimedia.getUrlArchivo());
        versionRepository.save(version);
        
        return new ResponseEntity<>(version, HttpStatus.OK);
    }
}