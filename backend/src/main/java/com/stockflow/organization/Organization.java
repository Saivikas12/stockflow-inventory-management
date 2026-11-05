package com.stockflow.organization;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "organizations")
public class Organization {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private Integer defaultLowStockThreshold = 5;

    private LocalDateTime createdAt = LocalDateTime.now();

    // Default constructor
    public Organization() {
    }

    // Parameterized constructor
    public Organization(String name) {
        this.name = name;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public void setName(String n) {
        name = n;
    }

    public Integer getDefaultLowStockThreshold() {
        return defaultLowStockThreshold;
    }

    public void setDefaultLowStockThreshold(Integer v) {
        defaultLowStockThreshold = v;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}