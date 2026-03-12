package com.automotriz.api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

import java.util.List;

@Data
public class AgenciaDTO {

    @NotBlank(message = "El nombre de la agencia es obligatorio")
    private String nombre;

    @NotBlank(message = "La ubicación de la agencia es obligatoria")
    private String ubicacion;

    @NotEmpty(message = "Debe especificar al menos un medio de pago")
    private List<String> mediosPago;
}