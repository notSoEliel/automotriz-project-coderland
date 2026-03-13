package com.automotriz.api.config;

import com.automotriz.api.entity.Agencia;
import com.automotriz.api.entity.Marca;
import com.automotriz.api.entity.Modelo;
import com.automotriz.api.entity.Version;
import com.automotriz.api.repository.AgenciaRepository;
import com.automotriz.api.repository.MarcaRepository;
import com.automotriz.api.repository.ModeloRepository;
import com.automotriz.api.repository.VersionRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

@Component
public class SeedDataRunner implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(SeedDataRunner.class);

    private final MarcaRepository marcaRepository;
    private final ModeloRepository modeloRepository;
    private final VersionRepository versionRepository;
    private final AgenciaRepository agenciaRepository;

    public SeedDataRunner(
            MarcaRepository marcaRepository,
            ModeloRepository modeloRepository,
            VersionRepository versionRepository,
            AgenciaRepository agenciaRepository
    ) {
        this.marcaRepository = marcaRepository;
        this.modeloRepository = modeloRepository;
        this.versionRepository = versionRepository;
        this.agenciaRepository = agenciaRepository;
    }

    @Override
    public void run(String... args) {
        if (!isDatabaseEmpty()) {
            logger.info("SeedDataRunner: datos existentes detectados, se omite el seed.");
            return;
        }

        Marca toyota = marcaRepository.save(new Marca(null, "Toyota"));
        Marca ford = marcaRepository.save(new Marca(null, "Ford"));
        Marca honda = marcaRepository.save(new Marca(null, "Honda"));

        Modelo corolla = modeloRepository.save(new Modelo(null, "Corolla", toyota, null));
        Modelo mustang = modeloRepository.save(new Modelo(null, "Mustang", ford, null));
        Modelo civic = modeloRepository.save(new Modelo(null, "Civic", honda, null));

        Version corollaLe = new Version();
        corollaLe.setTitulo("Corolla LE 2024");
        corollaLe.setDescripcion("Versión base económica.");
        corollaLe.setAno(2024);
        corollaLe.setMotor("Combustión");
        corollaLe.setCilindrada("1800 cc");
        corollaLe.setPrecioVentaBaseUsd(new BigDecimal("22500"));
        corollaLe.setPrecioVentaBaseVes(new BigDecimal("996075"));
        corollaLe.setPrecioAlquilerBaseUsd(new BigDecimal("45"));
        corollaLe.setPrecioAlquilerBaseVes(new BigDecimal("1992"));
        corollaLe.setModelo(corolla);
        versionRepository.save(corollaLe);

        Version mustangGt = new Version();
        mustangGt.setTitulo("Mustang GT Premium");
        mustangGt.setDescripcion("Potencia americana.");
        mustangGt.setAno(2024);
        mustangGt.setMotor("Combustión");
        mustangGt.setCilindrada("5000 cc");
        mustangGt.setPrecioVentaBaseUsd(new BigDecimal("48000"));
        mustangGt.setPrecioVentaBaseVes(new BigDecimal("2124960"));
        mustangGt.setPrecioAlquilerBaseUsd(new BigDecimal("120"));
        mustangGt.setPrecioAlquilerBaseVes(new BigDecimal("5312"));
        mustangGt.setModelo(mustang);
        versionRepository.save(mustangGt);

        Agencia agencia = new Agencia();
        agencia.setNombre("Agencia Sede Central");
        agencia.setUbicacion("Av. Principal, Capital City");
        agencia.setMediosPago(List.of("Efectivo", "Transferencia"));
        agenciaRepository.save(agencia);

        logger.info("SeedDataRunner: seed inicial aplicado.");
    }

    private boolean isDatabaseEmpty() {
        return marcaRepository.count() == 0
                && modeloRepository.count() == 0
                && versionRepository.count() == 0
                && agenciaRepository.count() == 0;
    }
}
