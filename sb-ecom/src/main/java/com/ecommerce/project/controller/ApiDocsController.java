package com.ecommerce.project.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
@Tag(name = "API Info", description = "API documentation and health check endpoints")
public class ApiDocsController {

    @GetMapping("/info")
    @Operation(
            summary = "Get API Information",
            description = "Returns basic information about the API including version and available documentation"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved API info")
    })
    public Map<String, Object> getApiInfo() {
        Map<String, Object> info = new HashMap<>();
        info.put("name", "E-Commerce REST API");
        info.put("version", "1.0.0");
        info.put("description", "Complete e-commerce solution with user management, products, orders, and payment integration");
        
        Map<String, String> docs = new HashMap<>();
        docs.put("swagger-ui", "/swagger-ui.html");
        docs.put("openapi-json", "/api-docs");
        docs.put("openapi-yaml", "/api-docs.yaml");
        info.put("documentation", docs);
        
        return info;
    }

    @GetMapping("/health")
    @Operation(
            summary = "Health Check",
            description = "Check if the API is running"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "API is healthy")
    })
    public Map<String, String> healthCheck() {
        Map<String, String> health = new HashMap<>();
        health.put("status", "UP");
        health.put("message", "E-Commerce API is running");
        return health;
    }
}
