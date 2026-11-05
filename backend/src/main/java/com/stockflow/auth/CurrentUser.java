package com.stockflow.auth;
import org.springframework.security.core.Authentication; import org.springframework.stereotype.Component; import org.springframework.web.server.ResponseStatusException; import org.springframework.http.HttpStatus;
@Component public class CurrentUser {
    private final UserRepository users;public CurrentUser(UserRepository u)
    {
        users=u;
    } 
    public AppUser get(Authentication a)
    {
        return users.findByEmail(a.getName()).orElseThrow(()->new ResponseStatusException(HttpStatus.UNAUTHORIZED));
    }
    }
