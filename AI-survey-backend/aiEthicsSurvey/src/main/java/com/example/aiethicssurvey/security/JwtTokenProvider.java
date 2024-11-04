package com.example.aiethicssurvey.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import com.example.aiethicssurvey.model.entity.User;
import java.security.Key;
import java.util.Date;
import java.util.Base64;

@Component
public class JwtTokenProvider {

    private final Key key;
    private final long validityInMilliseconds;

    public JwtTokenProvider(
            @Value("${jwt.secret}") String secret,
            @Value("${jwt.expiration}") long validityInMilliseconds) {
        byte[] keyBytes = Base64.getDecoder().decode(Base64.getEncoder().encodeToString(secret.getBytes()));
        this.key = Keys.hmacShaKeyFor(keyBytes);
        this.validityInMilliseconds = validityInMilliseconds;
    }

    public String generateToken(User user) {
        Claims claims = Jwts.claims().setSubject(user.getEmail());
        claims.put("id", user.getId());
        claims.put("username", user.getUsername());

        Date now = new Date();
        Date validity = new Date(now.getTime() + validityInMilliseconds);

        return Jwts.builder()
                .setClaims(claims)
                .setIssuedAt(now)
                .setExpiration(validity)
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    public String getEmailFromToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }
}
