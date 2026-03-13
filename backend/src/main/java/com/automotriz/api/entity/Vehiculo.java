package com.automotriz.api.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "vehiculos")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Vehiculo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String placa;

    @Column(name = "color_especifico", nullable = false)
    private String colorEspecifico;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EstadoVehiculo estado;

    // Precios Específicos (Opcionales - Permiten Null)
    @Column(name = "precio_venta_especifico_usd")
    private BigDecimal precioVentaEspecificoUsd;

    @Column(name = "precio_venta_especifico_ves")
    private BigDecimal precioVentaEspecificoVes;

    @Column(name = "precio_alquiler_especifico_usd")
    private BigDecimal precioAlquilerEspecificoUsd;

    @Column(name = "precio_alquiler_especifico_ves")
    private BigDecimal precioAlquilerEspecificoVes;

    @Column(name = "fecha_venta")
    private LocalDate fechaVenta;

    @Column(name = "fecha_alquiler")
    private LocalDate fechaAlquiler;

    @ManyToOne
    @JoinColumn(name = "version_id", nullable = false)
    private Version version;

    @ManyToOne
    @JoinColumn(name = "agencia_id", nullable = false)
    private Agencia agencia;

    @OneToMany(mappedBy = "vehiculo", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<VehiculoMultimedia> galerias;

    public enum EstadoVehiculo {
        DISPONIBLE, RESERVADO, VENDIDO, ALQUILADO
    }
}