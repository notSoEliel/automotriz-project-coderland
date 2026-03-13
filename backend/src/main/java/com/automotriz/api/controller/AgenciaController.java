package com.automotriz.api.controller;

import com.automotriz.api.dto.AgenciaDTO;
import com.automotriz.api.entity.Agencia;
import com.automotriz.api.repository.AgenciaRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/api/agencias")
public class AgenciaController {

    private final AgenciaRepository agenciaRepository;

    // Inyectamos el repositorio para que el controlador pueda usarlo
    public AgenciaController(AgenciaRepository agenciaRepository) {
        this.agenciaRepository = agenciaRepository;
    }

    // Endpoint para obtener todas las agencias
    @GetMapping
    public List<Agencia> obtenerTodas() {
        return agenciaRepository.findAll();
    }

    // Endpoint para obtener una agencia por su ID
    @GetMapping("/{id}")
    public ResponseEntity<Agencia> obtenerPorId(@PathVariable Long id) {
        return agenciaRepository.findById(id)
                .map(agencia -> new ResponseEntity<>(agencia, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    // Endpoint para crear una nueva agencia
    @PostMapping
    public ResponseEntity<Agencia> crearAgencia(@Valid @RequestBody AgenciaDTO agenciaDTO) {
        Agencia agencia = new Agencia();
        agencia.setNombre(agenciaDTO.getNombre());
        agencia.setUbicacion(agenciaDTO.getUbicacion());
        agencia.setMediosPago(agenciaDTO.getMediosPago());

        Agencia nuevaAgencia = agenciaRepository.save(agencia);
        return new ResponseEntity<>(nuevaAgencia, HttpStatus.CREATED);
    }

    // Endpoint para actualizar una agencia existente (PUT)
    @PutMapping("/{id}")
    public ResponseEntity<Agencia> actualizarAgencia(@PathVariable Long id, @Valid @RequestBody AgenciaDTO agenciaDTO) {
        return agenciaRepository.findById(id)
                .map(agencia -> {
                    agencia.setNombre(agenciaDTO.getNombre());
                    agencia.setUbicacion(agenciaDTO.getUbicacion());
                    agencia.setMediosPago(agenciaDTO.getMediosPago());
                    return new ResponseEntity<>(agenciaRepository.save(agencia), HttpStatus.OK);
                })
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    // Endpoint para eliminar una agencia (DELETE)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarAgencia(@PathVariable Long id) {
        if (agenciaRepository.existsById(id)) {
            agenciaRepository.deleteById(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT); // 204 Exitoso sin contenido
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND); // 404 Si no existe
    }

    @GetMapping("/medios-pago-sugeridos")
    public ResponseEntity<List<String>> obtenerMediosPagoSugeridos() {
        List<String> sugeridos = Arrays.asList(
                "Yappy", "ACH", "Efectivo", "Tarjeta de Crédito/Débito", // Opciones comunes en Panamá
                "Pago Móvil", "Zelle", "Binance/USDT", "Transferencia Nacional" // Opciones comunes en Venezuela
        );
        return new ResponseEntity<>(sugeridos, HttpStatus.OK);
    }
}