package com.automotriz.api.controller;

import com.automotriz.api.entity.Multimedia;
import com.automotriz.api.entity.Vehiculo;
import com.automotriz.api.repository.MultimediaRepository;
import com.automotriz.api.repository.VehiculoRepository;
import com.automotriz.api.service.FileStorageService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api")
public class MultimediaController {

    private final MultimediaRepository multimediaRepository;
    private final VehiculoRepository vehiculoRepository;
    private final FileStorageService fileStorageService;

    public MultimediaController(MultimediaRepository multimediaRepository, VehiculoRepository vehiculoRepository, FileStorageService fileStorageService) {
        this.multimediaRepository = multimediaRepository;
        this.vehiculoRepository = vehiculoRepository;
        this.fileStorageService = fileStorageService;
    }

    // POST: Subir foto física y convertir a WebP
    @PostMapping("/vehiculos/{vehiculoId}/fotos")
    public ResponseEntity<?> subirFoto(@PathVariable Long vehiculoId, @RequestParam("file") MultipartFile file) {
        Optional<Vehiculo> vehiculoOpt = vehiculoRepository.findById(vehiculoId);
        if (vehiculoOpt.isEmpty()) {
            return new ResponseEntity<>("El vehículo no existe", HttpStatus.NOT_FOUND);
        }

        try {
            String rutaWebp = fileStorageService.guardarImagenWebp(file);
            Multimedia multimedia = new Multimedia();
            multimedia.setUrlArchivo(rutaWebp);
            multimedia.setVehiculo(vehiculoOpt.get());
            return new ResponseEntity<>(multimediaRepository.save(multimedia), HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>("Error procesando la imagen", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // GET: La Regla de Oro
    @GetMapping("/vehiculos/{vehiculoId}/fotos")
    public ResponseEntity<?> obtenerFotos(@PathVariable Long vehiculoId) {
        Optional<Vehiculo> vehiculoOpt = vehiculoRepository.findById(vehiculoId);
        if (vehiculoOpt.isEmpty()) {
            return new ResponseEntity<>("El vehículo no existe", HttpStatus.NOT_FOUND);
        }

        Vehiculo vehiculo = vehiculoOpt.get();
        List<Multimedia> fotos = multimediaRepository.findByVehiculoId(vehiculoId);

        // Si el vehículo físico no tiene fotos, devolvemos la imagen por defecto de su Versión
        if (fotos.isEmpty()) {
            String imagenDefecto = vehiculo.getVersion().getImagenDefecto();
            return new ResponseEntity<>(Collections.singletonList(imagenDefecto), HttpStatus.OK);
        }

        // Si tiene fotos físicas, devolvemos las URLs procesadas
        List<String> urls = fotos.stream().map(Multimedia::getUrlArchivo).toList();
        return new ResponseEntity<>(urls, HttpStatus.OK);
    }

    // DELETE: Borrar foto física del disco y de la base de datos
    @DeleteMapping("/fotos/{fotoId}")
    public ResponseEntity<Void> eliminarFoto(@PathVariable Long fotoId) {
        Optional<Multimedia> fotoOpt = multimediaRepository.findById(fotoId);

        if (fotoOpt.isPresent()) {
            Multimedia foto = fotoOpt.get();

            // 1. Borrar el archivo del disco duro
            try {
                fileStorageService.borrarArchivo(foto.getUrlArchivo());
            } catch (RuntimeException e) {
                // Si falla al borrar el archivo físico, igual lo borramos de la BD para no dejar datos huérfanos
                System.err.println(e.getMessage());
            }

            // 2. Borrar el registro de la base de datos
            multimediaRepository.deleteById(fotoId);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }

        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
}