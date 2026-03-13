package com.automotriz.api.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "vehiculos_multimedia")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class VehiculoMultimedia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "nombre_archivo", nullable = false)
    private String nombreArchivo;

    @Column(name = "tipo_archivo", nullable = false)
    private String tipoArchivo;

    @Column(name = "ruta_archivo", nullable = false)
    private String rutaArchivo;

    @Column(name = "fecha_subida", nullable = false)
    private LocalDateTime fechaSubida;

    // Optional descriptor / tooltip for alt
    @Column
    private String descripcion;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vehiculo_id", nullable = false)
    @JsonIgnore
    private Vehiculo vehiculo;
}
