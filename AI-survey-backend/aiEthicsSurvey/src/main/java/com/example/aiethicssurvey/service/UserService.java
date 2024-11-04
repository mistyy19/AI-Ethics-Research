package com.example.aiethicssurvey.service;

import com.example.aiethicssurvey.model.entity.User;
import com.example.aiethicssurvey.repository.UserRepository;
import com.example.aiethicssurvey.model.dto.AuthResponse;
import com.example.aiethicssurvey.model.dto.AuthRequest;
import com.example.aiethicssurvey.model.dto.RegisterRequest;
import com.example.aiethicssurvey.model.dto.UserDto;
import com.example.aiethicssurvey.security.JwtTokenProvider;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already exists");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        User savedUser = userRepository.save(user);
        String token = jwtTokenProvider.generateToken(savedUser);

        return new AuthResponse(UserDto.fromEntity(savedUser), token);
    }

    public AuthResponse login(AuthRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        String token = jwtTokenProvider.generateToken(user);
        return new AuthResponse(UserDto.fromEntity(user), token);
    }

    public UserDto getCurrentUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return UserDto.fromEntity(user);
    }
}
