package com.stockflow.auth;

import com.stockflow.organization.Organization;
import com.stockflow.organization.OrganizationRepository;
import com.stockflow.security.JwtService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Locale;

/**
 * Public authentication endpoints: signup and login.
 */
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final OrganizationRepository organizationRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthController(
            UserRepository userRepository,
            OrganizationRepository organizationRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService
    ) {
        this.userRepository = userRepository;
        this.organizationRepository = organizationRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public record SignupRequest(
            @Email @NotBlank String email,
            @NotBlank @Size(min = 8) String password,
            @NotBlank String organizationName
    ) {}

    public record LoginRequest(
            @Email @NotBlank String email,
            @NotBlank String password
    ) {}

    public record AuthResponse(
            String token,
            String email,
            String organizationName
    ) {}

    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> signup(
            @Valid @RequestBody SignupRequest request
    ) {
        String email = normalizeEmail(request.email());

        if (userRepository.existsByEmail(email)) {
            throw new org.springframework.web.server.ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Email is already registered"
            );
        }

        // Each signup creates a new organization and links the new user to it.
        Organization organization = organizationRepository.save(
                new Organization(request.organizationName().trim())
        );

        String encryptedPassword =
                passwordEncoder.encode(request.password());

        AppUser user = userRepository.save(
                new AppUser(email, encryptedPassword, organization)
        );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(createAuthResponse(user));
    }

    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody LoginRequest request) {
        String email = normalizeEmail(request.email());

        AppUser user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new org.springframework.web.server.ResponseStatusException(
                                HttpStatus.UNAUTHORIZED,
                                "Invalid email or password"
                        )
                );

        boolean passwordMatches = passwordEncoder.matches(
                request.password(),
                user.getPassword()
        );

        if (!passwordMatches) {
            throw new org.springframework.web.server.ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Invalid email or password"
            );
        }

        return createAuthResponse(user);
    }

    private AuthResponse createAuthResponse(AppUser user) {
        String token = jwtService.generate(user.getEmail());

        return new AuthResponse(
                token,
                user.getEmail(),
                user.getOrganization().getName()
        );
    }

    private String normalizeEmail(String email) {
        return email.trim().toLowerCase(Locale.ROOT);
    }
}
