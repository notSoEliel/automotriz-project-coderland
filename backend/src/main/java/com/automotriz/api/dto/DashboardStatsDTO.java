package com.automotriz.api.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class DashboardStatsDTO {
    private long totalVehiculos;
    private long vehiculosDisponibles;
    private long vehiculosVendidos;
    private long totalAgencias;
}
