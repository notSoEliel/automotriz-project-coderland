package com.automotriz.api.dto;

import com.automotriz.api.entity.Vehiculo.EstadoVehiculo;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class VehiculoDTO {

    @NotBlank(message = "El VIN es obligatorio")
    private String vin;

    @NotBlank(message = "El color específico es obligatorio")
    private String colorEspecifico;

    @NotNull(message = "El estado del vehículo es obligatorio")
    private EstadoVehiculo estado;

    @Min(value = 0, message = "El precio no puede ser negativo")
    private BigDecimal precioVentaEspecificoUsd;

    @Min(value = 0, message = "El precio no puede ser negativo")
    private BigDecimal precioVentaEspecificoVes;

    @Min(value = 0, message = "El precio no puede ser negativo")
    private BigDecimal precioAlquilerEspecificoUsd;

    @Min(value = 0, message = "El precio no puede ser negativo")
    private BigDecimal precioAlquilerEspecificoVes;

    @PastOrPresent(message = "La fecha de venta no puede estar en el futuro")
    private LocalDate fechaVenta;

    @PastOrPresent(message = "La fecha de alquiler no puede estar en el futuro")
    private LocalDate fechaAlquiler;

    @NotNull(message = "El ID de la versión es obligatorio")
    private Long versionId;

    @NotNull(message = "El ID de la agencia es obligatorio")
    private Long agenciaId;
}