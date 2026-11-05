package com.stockflow.product;

import com.stockflow.auth.CurrentUser;
import com.stockflow.auth.AppUser;
import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.util.List;

/**
 * Handles HTTP requests related to products.
 *
 * Important: every database query includes the current user's organization ID.
 * This prevents one organization from reading or changing another organization's products.
 */
@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductRepository productRepository;
    private final CurrentUser currentUser;

    public ProductController(
            ProductRepository productRepository,
            CurrentUser currentUser
    ) {
        this.productRepository = productRepository;
        this.currentUser = currentUser;
    }

    /**
     * Request body used when creating or updating a product.
     * Validation annotations reject invalid data before it reaches the database.
     */
    public record ProductRequest(
            @NotBlank String name,
            @NotBlank String sku,
            String description,
            @NotNull @Min(0) Integer quantity,
            @DecimalMin("0.0") BigDecimal costPrice,
            @DecimalMin("0.0") BigDecimal sellingPrice,
            @Min(0) Integer lowStockThreshold
    ) {}

    @GetMapping
    public List<Product> getAllProducts(Authentication authentication) {
        AppUser user = currentUser.get(authentication);
        Long organizationId = user.getOrganization().getId();

        return productRepository
                .findAllByOrganization_IdOrderByUpdatedAtDesc(organizationId);
    }

    @PostMapping
    public ResponseEntity<Product> createProduct(
            @Valid @RequestBody ProductRequest request,
            Authentication authentication
    ) {
        AppUser user = currentUser.get(authentication);
        Long organizationId = user.getOrganization().getId();

        if (productRepository.existsByOrganization_IdAndSkuIgnoreCase(
                organizationId, request.sku().trim()
        )) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "SKU already exists in your organization"
            );
        }

        Product product = new Product();
        product.setOrganization(user.getOrganization());
        copyRequestToProduct(request, product);

        Product savedProduct = productRepository.save(product);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedProduct);
    }

    @PutMapping("/{productId}")
    public Product updateProduct(
            @PathVariable Long productId,
            @Valid @RequestBody ProductRequest request,
            Authentication authentication
    ) {
        AppUser user = currentUser.get(authentication);
        Long organizationId = user.getOrganization().getId();

        Product product = productRepository
                .findByIdAndOrganization_Id(productId, organizationId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Product not found"
                ));

        boolean skuBelongsToAnotherProduct =
                productRepository.existsByOrganization_IdAndSkuIgnoreCaseAndIdNot(
                        organizationId, request.sku().trim(), productId
                );

        if (skuBelongsToAnotherProduct) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "SKU already exists in your organization"
            );
        }

        copyRequestToProduct(request, product);
        return productRepository.save(product);
    }

    @DeleteMapping("/{productId}")
    public ResponseEntity<Void> deleteProduct(
            @PathVariable Long productId,
            Authentication authentication
    ) {
        Long organizationId = currentUser.get(authentication)
                .getOrganization().getId();

        Product product = productRepository
                .findByIdAndOrganization_Id(productId, organizationId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Product not found"
                ));

        productRepository.delete(product);
        return ResponseEntity.noContent().build();
    }

    /**
     * Copies validated request values into the JPA entity.
     * Keeping this in one method avoids repeating field assignments.
     */
    private void copyRequestToProduct(
            ProductRequest request,
            Product product
    ) {
        product.setName(request.name().trim());
        product.setSku(request.sku().trim());
        product.setDescription(request.description());
        product.setQuantity(request.quantity());
        product.setCostPrice(request.costPrice());
        product.setSellingPrice(request.sellingPrice());
        product.setLowStockThreshold(request.lowStockThreshold());
    }
}
