package com.stockflow.settings;

import com.stockflow.auth.CurrentUser;
import com.stockflow.organization.Organization;
import com.stockflow.organization.OrganizationRepository;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

/**
 * Reads and updates settings belonging to the signed-in organization.
 */
@RestController
@RequestMapping("/api/settings")
public class SettingsController {

    private final CurrentUser currentUser;
    private final OrganizationRepository organizationRepository;

    public SettingsController(
            CurrentUser currentUser,
            OrganizationRepository organizationRepository
    ) {
        this.currentUser = currentUser;
        this.organizationRepository = organizationRepository;
    }

    public record SettingsRequest(
            @NotNull @Min(0) Integer defaultLowStockThreshold
    ) {}

    public record SettingsResponse(int defaultLowStockThreshold) {}

    @GetMapping
    public SettingsResponse getSettings(Authentication authentication) {
        Organization organization = currentUser.get(authentication)
                .getOrganization();

        return new SettingsResponse(
                organization.getDefaultLowStockThreshold()
        );
    }

    @PutMapping
    public SettingsResponse updateSettings(
            @Valid @RequestBody SettingsRequest request,
            Authentication authentication
    ) {
        Organization organization = currentUser.get(authentication)
                .getOrganization();

        organization.setDefaultLowStockThreshold(
                request.defaultLowStockThreshold()
        );

        // Explicitly save the organization so the new setting is persisted.
        Organization savedOrganization =
                organizationRepository.save(organization);

        return new SettingsResponse(
                savedOrganization.getDefaultLowStockThreshold()
        );
    }
}
