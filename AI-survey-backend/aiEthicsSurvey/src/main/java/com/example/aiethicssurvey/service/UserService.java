package com.example.aiethicssurvey.service;

import com.example.aiethicssurvey.exception.InvalidCredentialsException;
import com.example.aiethicssurvey.exception.UserAlreadyExistsException;
import com.example.aiethicssurvey.model.entity.User;
import com.example.aiethicssurvey.model.dto.AuthResponse;
import com.example.aiethicssurvey.model.dto.AuthRequest;
import com.example.aiethicssurvey.model.dto.RegisterRequest;
import com.example.aiethicssurvey.model.dto.UserDto;
import com.example.aiethicssurvey.repository.UserRepository;
import com.example.aiethicssurvey.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        // 检查邮箱是否已存在
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new UserAlreadyExistsException("Email already exists");
        }
        // 检查用户名是否已存在
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new UserAlreadyExistsException("Username already exists");
        }

        // 创建新用户
        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        User savedUser = userRepository.save(user);
        String token = jwtTokenProvider.generateToken(savedUser);

        return new AuthResponse(UserDto.fromEntity(savedUser), token);
    }

    public AuthResponse login(AuthRequest request) {
        // 查找用户，若不存在则抛出异常
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new InvalidCredentialsException("User not found"));

        // 验证密码是否匹配
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new InvalidCredentialsException("Invalid password");
        }

        String token = jwtTokenProvider.generateToken(user);
        return new AuthResponse(UserDto.fromEntity(user), token);
    }

    public UserDto getCurrentUser(String email) {
        // 根据邮箱获取用户信息
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new InvalidCredentialsException("User not found"));
        return UserDto.fromEntity(user);
    }
}
