package itmo.is.lab1.user.dto;

import itmo.is.lab1.user.model.Role;
import lombok.Getter;

@Getter
public class AuthResponseDTO {
    private String username;
    private Role role;
    private String token;
    private final String tokenType = "Bearer ";

    public AuthResponseDTO(String username, Role role, String token) {
        this.username = username;
        this.role = role;
        this.token = token;
    }
}