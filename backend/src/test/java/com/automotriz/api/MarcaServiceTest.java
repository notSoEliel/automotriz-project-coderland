package com.automotriz.api;

import com.automotriz.api.controller.MarcaController;
import com.automotriz.api.dto.MarcaDTO;
import com.automotriz.api.entity.Marca;
import com.automotriz.api.repository.MarcaRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class MarcaServiceTest {

    @Mock
    private MarcaRepository marcaRepository;

    @InjectMocks
    private MarcaController marcaController;

    @Test
    void noDebeEliminarMarcaConModelosAsociados() {
        Long marcaId = 1L;
        when(marcaRepository.existsById(marcaId)).thenReturn(true);
        doThrow(new DataIntegrityViolationException("No se puede eliminar porque tiene modelos asociados"))
                .when(marcaRepository).deleteById(marcaId);

        assertThatThrownBy(() -> marcaController.eliminarMarca(marcaId))
                .isInstanceOf(DataIntegrityViolationException.class);
    }

    @Test
    void debeCrearMarcaExitosamente() {
        MarcaDTO dto = new MarcaDTO();
        dto.setNombre("Toyota");

        Marca marcaGuardada = new Marca();
        marcaGuardada.setId(1L);
        marcaGuardada.setNombre("Toyota");

        when(marcaRepository.save(any(Marca.class))).thenReturn(marcaGuardada);

        ResponseEntity<Marca> response = marcaController.crearMarca(dto);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getId()).isEqualTo(1L);
        assertThat(response.getBody().getNombre()).isEqualTo("Toyota");
    }
}
