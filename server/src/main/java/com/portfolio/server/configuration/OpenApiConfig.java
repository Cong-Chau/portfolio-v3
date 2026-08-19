package com.portfolio.server.configuration;

import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
@SecurityScheme(
        name = "bearerAuth",
        type = SecuritySchemeType.HTTP,
        scheme = "bearer",
        bearerFormat = "JWT"
)
public class OpenApiConfig {

    @Value("${server.openapi.dev-url:http://localhost:8080}")
    private String devUrl;

    @Value("${server.openapi.prod-url:}")
    private String prodUrl;

    @Bean
    public OpenAPI openAPI() {
        Server serverDev = new Server().url(devUrl + "/api").description("Development Server");
        OpenAPI openAPI = new OpenAPI()
                .info(new Info().title("Portfolio API").version("1.0").description("Portfolio Backend API Documentation"))
                .addSecurityItem(new SecurityRequirement().addList("bearerAuth"));

        if (prodUrl != null && !prodUrl.isBlank() && !prodUrl.contains("your-production-url.com")) {
            Server serverProd = new Server().url(prodUrl + "/api").description("Production Server");
            openAPI.servers(List.of(serverProd, serverDev));
        } else {
            openAPI.servers(List.of(serverDev));
        }

        return openAPI;
    }
}
