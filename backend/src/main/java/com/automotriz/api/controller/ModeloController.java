package com.automotriz.api.controller;

import com.automotriz.api.dto.ModeloDTO;
import com.automotriz.api.entity.Marca;
import com.automotriz.api.entity.Modelo;
import com.automotriz.api.entity.Version;
import com.automotriz.api.repository.MarcaRepository;
import com.automotriz.api.repository.ModeloRepository;
import com.automotriz.api.repository.VersionRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/modelos")
public class ModeloController {

    private final ModeloRepository modeloRepository;
    private final MarcaRepository marcaRepository;
    private final VersionRepository versionRepository;

    public ModeloController(ModeloRepository modeloRepository, MarcaRepository marcaRepository, VersionRepository versionRepository) {
        this.modeloRepository = modeloRepository;
        this.marcaRepository = marcaRepository;
        this.versionRepository = versionRepository;
    }

    @GetMapping
    public List<Modelo> obtenerTodos() {
        return modeloRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<?> crearModelo(@Valid @RequestBody ModeloDTO modeloDTO) {
        Optional<Marca> marcaOpt = marcaRepository.findById(modeloDTO.getMarcaId());

        if (marcaOpt.isPresent()) {
            Modelo modelo = new Modelo();
            modelo.setNombre(modeloDTO.getNombre());
            modelo.setMarca(marcaOpt.get());
            return new ResponseEntity<>(modeloRepository.save(modelo), HttpStatus.CREATED);
        }

        return new ResponseEntity<>("La marca especificada no existe", HttpStatus.BAD_REQUEST);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizarModelo(@PathVariable Long id, @Valid @RequestBody ModeloDTO modeloDTO) {
        Optional<Modelo> modeloOpt = modeloRepository.findById(id);
        if (modeloOpt.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        Optional<Marca> marcaOpt = marcaRepository.findById(modeloDTO.getMarcaId());
        if (marcaOpt.isEmpty()) {
            return new ResponseEntity<>("La marca especificada no existe", HttpStatus.BAD_REQUEST);
        }

        Modelo modelo = modeloOpt.get();
        modelo.setNombre(modeloDTO.getNombre());
        modelo.setMarca(marcaOpt.get());
        return new ResponseEntity<>(modeloRepository.save(modelo), HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarModelo(@PathVariable Long id) {
        if (modeloRepository.existsById(id)) {
            modeloRepository.deleteById(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @GetMapping("/marca/{marcaId}")
    public ResponseEntity<List<Modelo>> obtenerModelosPorMarca(@PathVariable Long marcaId) {
        List<Modelo> modelos = modeloRepository.findByMarcaId(marcaId);
        
        for (Modelo modelo : modelos) {
            List<Version> versiones = versionRepository.findByModeloId(modelo.getId());
            if (!versiones.isEmpty()) {
                modelo.setImagenDestacada(versiones.get(0).getImagenDefecto());
            }
        }
        
        return new ResponseEntity<>(modelos, HttpStatus.OK);
    }
}