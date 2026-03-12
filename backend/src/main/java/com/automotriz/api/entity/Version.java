package com.automotriz.api.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.math.BigDecimal;
import java.util.List;

@Entity
@Table(name = "versiones")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Version {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String titulo; // Ej. "Toyota Corolla 2026 LE"

    @Column(columnDefinition = "TEXT")
    private String descripcion;

    @Column(nullable = false)
    private Integer ano;

    @Column(nullable = false)
    private String motor;

    @Column(nullable = false)
    private String cilindrada;

    // Colores que la fábrica ofrece para esta versión
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "colores_disponibles", columnDefinition = "jsonb")
    private List<String> coloresDisponibles;

    // Precios Base (Catálogo)
    @Column(name = "precio_venta_base_usd", nullable = false)
    private BigDecimal precioVentaBaseUsd;

    @Column(name = "precio_venta_base_ves", nullable = false)
    private BigDecimal precioVentaBaseVes;

    @Column(name = "precio_alquiler_base_usd", nullable = false)
    private BigDecimal precioAlquilerBaseUsd;

    @Column(name = "precio_alquiler_base_ves", nullable = false)
    private BigDecimal precioAlquilerBaseVes;

    @Column(name = "imagen_defecto")
    private String imagenDefecto;

    @ManyToOne
    @JoinColumn(name = "modelo_id", nullable = false)
    private Modelo modelo;
}