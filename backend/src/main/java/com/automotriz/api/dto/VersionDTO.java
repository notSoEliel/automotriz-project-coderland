package com.automotriz.api.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class VersionDTO {

    @NotBlank(message = "El título es obligatorio")
    private String titulo;

    private String descripcion;

    @NotNull(message = "El año es obligatorio")
    @Min(value = 1886, message = "El año no es válido")
    private Integer ano;

    @NotBlank(message = "El motor es obligatorio")
    private String motor;

    @NotBlank(message = "La cilindrada es obligatoria")
    private String cilindrada;

    private List<String> coloresDisponibles;

    @NotNull(message = "El precio de venta en USD es obligatorio")
    @Min(value = 0, message = "El precio no puede ser negativo")
    private BigDecimal precioVentaBaseUsd;

    @NotNull(message = "El precio de venta en VES es obligatorio")
    @Min(value = 0, message = "El precio no puede ser negativo")
    private BigDecimal precioVentaBaseVes;

    @NotNull(message = "El precio de alquiler en USD es obligatorio")
    @Min(value = 0, message = "El precio no puede ser negativo")
    private BigDecimal precioAlquilerBaseUsd;

    @NotNull(message = "El precio de alquiler en VES es obligatorio")
    @Min(value = 0, message = "El precio no puede ser negativo")
    private BigDecimal precioAlquilerBaseVes;

    @NotNull(message = "El ID del modelo es obligatorio")
    private Long modeloId;
}