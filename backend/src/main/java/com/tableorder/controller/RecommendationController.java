package com.tableorder.controller;

import com.tableorder.dto.recommendation.RecommendRequest;
import com.tableorder.dto.recommendation.RecommendationResponse;
import com.tableorder.security.AuthDetails;
import com.tableorder.service.RecommendationService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recommendations")
public class RecommendationController {

    private final RecommendationService recommendationService;

    public RecommendationController(RecommendationService recommendationService) {
        this.recommendationService = recommendationService;
    }

    @PostMapping
    public ResponseEntity<List<RecommendationResponse>> getRecommendation(
            @Valid @RequestBody RecommendRequest request,
            Authentication authentication) {
        Long storeId = ((AuthDetails) authentication.getCredentials()).storeId();
        return ResponseEntity.ok(recommendationService.getRecommendations(storeId, request));
    }
}
