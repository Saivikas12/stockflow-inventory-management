package com.stockflow.security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;

import java.util.Date;

@Service
public class JwtService {

    @Value("${app.jwt.secret}")
    private String secret;

    @Value("${app.jwt.expiration-ms}")
    private long expiration;

    // Generate Secret Key
    private SecretKey key() {
        return Keys.hmacShaKeyFor(
                java.util.Base64.getDecoder().decode(secret)
        );
    }

    // Generate JWT Token
    public String generate(String email) {

        Date now = new Date();

        return Jwts.builder()
                .subject(email)
                .issuedAt(now)
                .expiration(new Date(now.getTime() + expiration))
                .signWith(key())
                .compact();
    }

    // Extract Email from JWT Token
    public String extractEmail(String token) {

        return Jwts.parser()
                .verifyWith(key())
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getSubject();
    }

    // Validate JWT Token
    public boolean valid(String token) {

        try {
            return extractEmail(token) != null;

        } catch (Exception e) {
            return false;
        }
    }
}