package com.stockflow.dashboard;

import com.stockflow.auth.CurrentUser;
import com.stockflow.product.Product;
import com.stockflow.product.ProductRepository;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * Returns the summary information displayed on the dashboard.
 */
@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final ProductRepository productRepository;
    private final CurrentUser currentUser;

    public DashboardController(
            ProductRepository productRepository,
            CurrentUser currentUser
    ) {
        this.productRepository = productRepository;
        this.currentUser = currentUser;
    }

    public record DashboardResponse(
            long totalProducts,
            long totalQuantity,
            int defaultLowStockThreshold,
            List<Product> lowStockItems
    ) {}

    @GetMapping
    public DashboardResponse getDashboard(Authentication authentication) {
        Long organizationId = currentUser.get(authentication)
                .getOrganization().getId();

        int defaultThreshold = currentUser.get(authentication)
                .getOrganization().getDefaultLowStockThreshold();

        List<Product> allProducts = productRepository
                .findAllByOrganization_IdOrderByUpdatedAtDesc(organizationId);

        List<Product> lowStockProducts = allProducts.stream()
                .filter(product -> {
                    Integer productThreshold = product.getLowStockThreshold();

                    int threshold = productThreshold == null
                            ? defaultThreshold
                            : productThreshold;

                    return product.getQuantity() <= threshold;
                })
                .toList();

        long totalQuantity = productRepository.totalQuantity(organizationId);

        return new DashboardResponse(
                allProducts.size(),
                totalQuantity,
                defaultThreshold,
                lowStockProducts
        );
    }
}
