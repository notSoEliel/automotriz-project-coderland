package com.automotriz.api.service;

import com.sksamuel.scrimage.ImmutableImage;
import com.sksamuel.scrimage.webp.WebpWriter;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class FileStorageService {

    // Ruta dentro del contenedor que vinculamos en el docker-compose
    private final Path rootLocation = Paths.get("/app/uploads");

    public FileStorageService() {
        try {
            Files.createDirectories(rootLocation);
        } catch (IOException e) {
            throw new RuntimeException("No se pudo inicializar la carpeta de subidas", e);
        }
    }

    public String guardarImagenWebp(MultipartFile file) throws IOException {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("El archivo está vacío");
        }

        // Generar un nombre único para evitar sobreescribir fotos
        String nombreArchivo = UUID.randomUUID().toString() + ".webp";
        File archivoDestino = this.rootLocation.resolve(nombreArchivo).toFile();

        // Convertir y guardar usando Scrimage
        ImmutableImage.loader().fromStream(file.getInputStream())
                .output(WebpWriter.DEFAULT, archivoDestino);

        // Devolvemos la ruta relativa que guardaremos en la base de datos
        return "/uploads/" + nombreArchivo;
    }

    public void borrarArchivo(String rutaRelativa) {
        try {
            // Extraemos solo el nombre del archivo de la ruta "/uploads/nombre.webp"
            String nombreArchivo = rutaRelativa.replace("/uploads/", "");
            Path archivoDestino = this.rootLocation.resolve(nombreArchivo);
            Files.deleteIfExists(archivoDestino);
        } catch (IOException e) {
            throw new RuntimeException("Error al borrar el archivo físico del servidor", e);
        }
    }
}