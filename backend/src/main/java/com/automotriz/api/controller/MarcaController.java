package com.automotriz.api.controller;

import com.automotriz.api.dto.MarcaDTO;
import com.automotriz.api.entity.Marca;
import com.automotriz.api.repository.MarcaRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/marcas")
public class MarcaController {

    private final MarcaRepository marcaRepository;

    public MarcaController(MarcaRepository marcaRepository) {
        this.marcaRepository = marcaRepository;
    }

    @GetMapping
    public List<Marca> obtenerTodas() {
        return marcaRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<Marca> crearMarca(@Valid @RequestBody MarcaDTO marcaDTO) {
        Marca marca = new Marca();
        marca.setNombre(marcaDTO.getNombre());
        return new ResponseEntity<>(marcaRepository.save(marca), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Marca> actualizarMarca(@PathVariable Long id, @Valid @RequestBody MarcaDTO marcaDTO) {
        return marcaRepository.findById(id)
                .map(marca -> {
                    marca.setNombre(marcaDTO.getNombre());
                    return new ResponseEntity<>(marcaRepository.save(marca), HttpStatus.OK);
                })
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarMarca(@PathVariable Long id) {
        if (marcaRepository.existsById(id)) {
            marcaRepository.deleteById(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
}