package com.stockflow.config;

import com.stockflow.security.JwtAuthFilter;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
public class SecurityConfig {

    // Password Encoder
    @Bean
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // Security Filter Chain
    @Bean
    SecurityFilterChain filterChain(
            HttpSecurity http,
            JwtAuthFilter filter
    ) throws Exception {

        return http
                .csrf(c -> c.disable())

                .cors(c -> c.configurationSource(corsSource()))

                .sessionManagement(s ->
                        s.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )

                .authorizeHttpRequests(a -> a
                        .requestMatchers("/api/auth/**", "/error").permitAll()
                        .anyRequest().authenticated()
                )

                .addFilterBefore(
                        filter,
                        UsernamePasswordAuthenticationFilter.class
                )

                .build();
    }

    // CORS Configuration
    @Bean
    CorsConfigurationSource corsSource() {

        CorsConfiguration c = new CorsConfiguration();

        c.setAllowedOrigins(
                List.of("http://localhost:5173")
        );

        c.setAllowedMethods(
                List.of("GET", "POST", "PUT", "DELETE", "OPTIONS")
        );

        c.setAllowedHeaders(
                List.of("*")
        );

        c.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource s =
                new UrlBasedCorsConfigurationSource();

        s.registerCorsConfiguration("/**", c);

        return s;
    }
}