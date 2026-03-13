package com.automotriz.api;

import com.automotriz.api.controller.VehiculoController;
import com.automotriz.api.dto.VehiculoDTO;
import com.automotriz.api.entity.Agencia;
import com.automotriz.api.entity.Vehiculo;
import com.automotriz.api.entity.Vehiculo.EstadoVehiculo;
import com.automotriz.api.entity.Version;
import com.automotriz.api.exception.GlobalExceptionHandler;
import com.automotriz.api.repository.AgenciaRepository;
import com.automotriz.api.repository.VehiculoMultimediaRepository;
import com.automotriz.api.repository.VehiculoRepository;
import com.automotriz.api.repository.VersionRepository;
import com.automotriz.api.service.FileStorageService;
import org.springframework.data.web.config.SpringDataJackson3Configuration;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.json.JacksonJsonHttpMessageConverter;
import org.springframework.http.converter.StringHttpMessageConverter;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import tools.jackson.databind.ObjectMapper;
import tools.jackson.databind.json.JsonMapper;

import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
public class VehiculoServiceTest {

    @Mock
    private VehiculoRepository vehiculoRepository;
    @Mock
    private VersionRepository versionRepository;
    @Mock
    private AgenciaRepository agenciaRepository;
    @Mock
    private VehiculoMultimediaRepository vehiculoMultimediaRepository;
    @Mock
    private FileStorageService fileStorageService;

    @InjectMocks
    private VehiculoController vehiculoController;

    private MockMvc mockMvc;
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        SpringDataJackson3Configuration springDataJackson = new SpringDataJackson3Configuration();
        JsonMapper jsonMapper = JsonMapper.builder()
                .addModule(springDataJackson.jackson3pageModule())
                .findAndAddModules()
                .build();

        objectMapper = jsonMapper;
        JacksonJsonHttpMessageConverter converter = new JacksonJsonHttpMessageConverter(jsonMapper);

        mockMvc = MockMvcBuilders.standaloneSetup(vehiculoController)
                .setControllerAdvice(new GlobalExceptionHandler())
                .setMessageConverters(
                        new StringHttpMessageConverter(StandardCharsets.UTF_8),
                        converter
                )
                .build();
    }

    @Test
    void debeLanzarExcepcionCuandoPrecioEsNegativo() throws Exception {
        VehiculoDTO dto = new VehiculoDTO();
        dto.setPlaca("ABC-123");
        dto.setColorEspecifico("Rojo");
        dto.setEstado(EstadoVehiculo.DISPONIBLE);
        dto.setPrecioVentaEspecificoUsd(new BigDecimal("-1000")); // Precio negativo
        dto.setVersionId(1L);
        dto.setAgenciaId(1L);

        mockMvc.perform(post("/api/vehiculos")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(dto)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.precioVentaEspecificoUsd").value("El precio no puede ser negativo"));
    }

    @Test
    void debeFiltrarCorrectamentePorAgencia() throws Exception {
        Vehiculo vehiculo = new Vehiculo();
        vehiculo.setId(1L);
        vehiculo.setPlaca("DEF-456");

        // Crear la página de forma que Jackson pueda leerla
        Page<Vehiculo> pageDePrueba = new PageImpl<>(List.of(vehiculo));

        when(vehiculoRepository.findByFiltros(any(), any(), any(), any()))
                .thenReturn(pageDePrueba);

        mockMvc.perform(get("/api/vehiculos")
                        .param("agenciaId", "1")
                        .param("page", "0")
                        .param("size", "10")
                        .accept(MediaType.APPLICATION_JSON)) // Forzar aceptación de JSON
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].placa").value("DEF-456"));
    }

    @Test
    void noDebePermitirDuplicadosDeVIN() {
        VehiculoDTO dto = new VehiculoDTO();
        dto.setPlaca("DUP-999");
        dto.setColorEspecifico("Negro");
        dto.setEstado(EstadoVehiculo.DISPONIBLE);
        dto.setVersionId(1L);
        dto.setAgenciaId(1L);

        when(versionRepository.findById(1L)).thenReturn(Optional.of(new Version()));
        when(agenciaRepository.findById(1L)).thenReturn(Optional.of(new Agencia()));
        
        when(vehiculoRepository.save(any(Vehiculo.class))).thenThrow(new DataIntegrityViolationException("Unique constraint violation"));

        assertThatThrownBy(() -> {
            vehiculoController.crearVehiculo(dto);
        }).isInstanceOf(DataIntegrityViolationException.class);
    }

    @Test
    void debeRetornarBadRequestSiNoExisteVersionAlCrearVehiculo() {
        VehiculoDTO dto = new VehiculoDTO();
        dto.setVersionId(99L);
        dto.setAgenciaId(1L);

        when(versionRepository.findById(99L)).thenReturn(Optional.empty());

        ResponseEntity<?> response = vehiculoController.crearVehiculo(dto);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        assertThat(response.getBody()).isEqualTo("La versión especificada no existe");
        verify(vehiculoRepository, never()).save(any());
    }

    @Test
    void debeRetornarPaginaVaciaCuandoElIndiceExcedeElTotal() throws Exception {
        Page<Vehiculo> paginaVacia = new PageImpl<>(Collections.emptyList(), PageRequest.of(100, 10), 0);

        when(vehiculoRepository.findAll((PageRequest) any())).thenReturn(paginaVacia);

        mockMvc.perform(get("/api/vehiculos")
                .param("page", "100")
                .param("size", "10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isEmpty())
                .andExpect(jsonPath("$.empty").value(true));
    }

    @Test
    void debeRechazarArchivoConExtensionNoPermitida() throws Exception {
        MockMultipartFile file = new MockMultipartFile("file", "malicioso.exe", "application/x-msdownload", "contenido".getBytes());
        
        when(vehiculoRepository.findById(1L)).thenReturn(Optional.of(new Vehiculo()));
        when(fileStorageService.guardarImagenWebp(any())).thenThrow(new IllegalArgumentException("Extensión no permitida"));

        mockMvc.perform(multipart("/api/vehiculos/1/multimedia")
                .file(file))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Extensión no permitida"));
    }
}
