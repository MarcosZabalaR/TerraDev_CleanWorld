package com.terradev.cleanworld.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
public class JwtUtil {

    // Clave secreta (para pruebas puedes dejar fija, en producción debe estar en env)
    private final String SECRET_KEY = "EB86B158E701E339CDE2C8694D1C64B127564987D673E44BB1B5615B431049DD";

    // Expiración en milisegundos (por ejemplo 1 hora)
    private final long EXPIRATION = 1000 * 60 * 60;

    // Generar token
    public String generateToken(String email) {
        return Jwts.builder()
                .setSubject(email)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION))
                .signWith(SignatureAlgorithm.HS256, SECRET_KEY)
                .compact();
    }

    // Obtener email del token
    public String extractEmail(String token) {
        return getClaims(token).getSubject();
    }

    // Validar token
    public boolean validateToken(String token, String email) {
        return extractEmail(token).equals(email) && !isTokenExpired(token);
    }

    private boolean isTokenExpired(String token) {
        return getClaims(token).getExpiration().before(new Date());
    }

    private Claims getClaims(String token) {
        return Jwts.parser()
                .setSigningKey(SECRET_KEY)
                .parseClaimsJws(token)
                .getBody();
    }
}
