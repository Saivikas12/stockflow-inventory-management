package com.stockflow.security;

import com.stockflow.auth.UserRepository;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtService jwt;
    private final UserRepository users;

    // Constructor Injection
    public JwtAuthFilter(JwtService j, UserRepository u) {
        jwt = j;
        users = u;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest req,
            HttpServletResponse res,
            FilterChain chain
    ) throws ServletException, IOException {

        String h = req.getHeader("Authorization");

        if (h != null && h.startsWith("Bearer ")) {

            String token = h.substring(7);

            if (jwt.valid(token)) {

                String email = jwt.extractEmail(token);

                users.findByEmail(email).ifPresent(u -> {

                    var principal = User.withUsername(u.getEmail())
                            .password(u.getPassword())
                            .authorities(List.of())
                            .build();

                    var auth = new UsernamePasswordAuthenticationToken(
                            principal,
                            null,
                            principal.getAuthorities()
                    );

                    auth.setDetails(
                            new WebAuthenticationDetailsSource()
                                    .buildDetails(req)
                    );

                    SecurityContextHolder.getContext()
                            .setAuthentication(auth);
                });
            }
        }

        chain.doFilter(req, res);
    }
}
