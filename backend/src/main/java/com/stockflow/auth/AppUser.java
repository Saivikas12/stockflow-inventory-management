package com.stockflow.auth;

import java.time.LocalDateTime;

import com.stockflow.organization.Organization;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "users")
public class AppUser {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @ManyToOne(optional = false)
    @JoinColumn(name = "organization_id")
    private Organization organization;

    private LocalDateTime createdAt = LocalDateTime.now();

    // Default Constructor
    public AppUser() {
    }

    // Parameterized Constructor
    public AppUser(String email, String password, Organization organization) {
        this.email = email;
        this.password = password;
        this.organization = organization;
    }

    // Getters
    public Long getId() {
        return id;
    }

    public String getEmail() {
        return email;
    }

    public String getPassword() {
        return password;
    }

    public Organization getOrganization() {
        return organization;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}