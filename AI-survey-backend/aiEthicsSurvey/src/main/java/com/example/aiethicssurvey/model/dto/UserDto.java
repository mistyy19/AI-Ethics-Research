package com.example.aiethicssurvey.model.dto;

import com.example.aiethicssurvey.model.entity.User;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class UserDto {
    private Long id;
    private String username;
    private String email;
    private LocalDateTime createdAt;

    public static UserDto fromEntity(User user) {
        UserDto dto = new UserDto();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        dto.setCreatedAt(user.getCreatedAt());
        return dto;
    }
}
