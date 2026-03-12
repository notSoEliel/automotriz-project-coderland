package com.automotriz.api.config;

import com.automotriz.api.security.JwtFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtFilter jwtFilter;

    public SecurityConfig(JwtFilter jwtFilter) {
        this.jwtFilter = jwtFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(auth -> auth
                        // Rutas públicas de lectura (GET) y documentación
                        .requestMatchers(HttpMethod.GET, "/api/**").permitAll()
                        .requestMatchers("/scalar/**", "/v3/api-docs/**").permitAll()
                        // Ruta para iniciar sesión y obtener el token
                        .requestMatchers(HttpMethod.POST, "/api/auth/login").permitAll()
                        // Cualquier otra petición (POST, PUT, DELETE) requiere estar autenticado
                        .anyRequest().authenticated()
                )
                // Conexión de filtro personalizado
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}