package com.example.aiethicssurvey.controller;

import com.example.aiethicssurvey.service.UserService;
import com.example.aiethicssurvey.model.dto.AuthResponse;
import com.example.aiethicssurvey.model.dto.AuthRequest;
import com.example.aiethicssurvey.model.dto.RegisterRequest;
import com.example.aiethicssurvey.model.dto.UserDto;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final UserService userService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {
        return ResponseEntity.ok(userService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest request) {
        return ResponseEntity.ok(userService.login(request));
    }

    @GetMapping("/me")
    public ResponseEntity<UserDto> getCurrentUser(@AuthenticationPrincipal String email) {
        return ResponseEntity.ok(userService.getCurrentUser(email));
    }
}
