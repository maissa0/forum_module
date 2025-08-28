package com.forumapp.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Collections;
import java.util.Date;

@Component
public class JwtTokenProvider {

    private final Key key;
    private final long validityInMilliseconds;

    public JwtTokenProvider(@Value("${jwt.secret}") String secret,
                          @Value("${jwt.expiration}") long validityInMilliseconds) {
        this.key = Keys.hmacShaKeyFor(secret.getBytes());
        this.validityInMilliseconds = validityInMilliseconds;
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    public String getUsernameFromToken(String token) {
        return Jwts.parserBuilder()
                  .setSigningKey(key)
                  .build()
                  .parseClaimsJws(token)
                  .getBody()
                  .getSubject();
    }

    public Authentication getAuthentication(String token) {
        Claims claims = Jwts.parserBuilder()
                           .setSigningKey(key)
                           .build()
                           .parseClaimsJws(token)
                           .getBody();

        String role = claims.get("role", String.class);
        return new UsernamePasswordAuthenticationToken(
            claims.getSubject(),
            null,
            Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + role))
        );
    }
}