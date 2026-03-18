package com.tableorder.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.tableorder.dto.recommendation.RecommendRequest;
import com.tableorder.dto.recommendation.RecommendationResponse;
import com.tableorder.dto.recommendation.RecommendationResponse.RecommendedMenuItem;
import com.tableorder.entity.Menu;
import com.tableorder.exception.OpenAiApiException;
import com.tableorder.repository.MenuRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class RecommendationService {

    private static final Logger log = LoggerFactory.getLogger(RecommendationService.class);
    private final MenuRepository menuRepository;
    private final RestClient restClient;
    private final ObjectMapper objectMapper;
    private final String apiKey;
    private final String apiUrl;
    private final String model;

    public RecommendationService(MenuRepository menuRepository,
                                  @Value("${app.openai.api-key}") String apiKey,
                                  @Value("${app.openai.api-url}") String apiUrl,
                                  @Value("${app.openai.model}") String model,
                                  @Value("${app.openai.connect-timeout}") int connectTimeout,
                                  @Value("${app.openai.read-timeout}") int readTimeout) {
        this.menuRepository = menuRepository;
        this.apiKey = apiKey;
        this.apiUrl = apiUrl;
        this.model = model;
        this.objectMapper = new ObjectMapper();
        this.restClient = RestClient.builder()
                .baseUrl(apiUrl)
                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .build();
    }

    public List<RecommendationResponse> getRecommendations(Long storeId, RecommendRequest request) {
        List<Menu> menus = menuRepository.findByStoreIdOrderByDisplayOrderAsc(storeId);
        if (menus.isEmpty()) {
            throw new IllegalStateException("No menus available for recommendation");
        }

        Map<Long, Menu> menuMap = menus.stream().collect(Collectors.toMap(Menu::getId, m -> m));

        String menuInfo = menus.stream()
                .map(m -> String.format("ID:%d, Name:%s, Price:%d원, Category:%d", m.getId(), m.getName(), m.getPrice(), m.getCategoryId()))
                .collect(Collectors.joining("\n"));

        String systemPrompt = """
                You are a restaurant menu recommendation assistant.
                Available menus:
                %s
                
                Respond ONLY with a JSON array of 2-3 combinations. Each combination:
                {"combinationName": "...", "items": [{"menuId": 1, "quantity": 2}]}
                """.formatted(menuInfo);

        String userPrompt = "Party size: %d, Dining type: %s. Recommend 2-3 menu combinations."
                .formatted(request.partySize(), request.diningType().name());

        try {
            Map<String, Object> body = Map.of(
                    "model", model,
                    "messages", List.of(
                            Map.of("role", "system", "content", systemPrompt),
                            Map.of("role", "user", "content", userPrompt)
                    ),
                    "temperature", 0.7
            );

            String responseBody = restClient.post()
                    .header("Authorization", "Bearer " + apiKey)
                    .body(body)
                    .retrieve()
                    .body(String.class);

            JsonNode root = objectMapper.readTree(responseBody);
            String content = root.path("choices").get(0).path("message").path("content").asText();

            // Parse JSON from content (may be wrapped in markdown code block)
            String jsonContent = content.replaceAll("```json\\s*", "").replaceAll("```\\s*", "").trim();
            List<Map<String, Object>> combinations = objectMapper.readValue(jsonContent, new TypeReference<>() {});

            List<RecommendationResponse> results = new ArrayList<>();
            for (Map<String, Object> combo : combinations) {
                String name = (String) combo.get("combinationName");
                List<Map<String, Object>> items = (List<Map<String, Object>>) combo.get("items");
                List<RecommendedMenuItem> menuItems = new ArrayList<>();
                int total = 0;

                for (Map<String, Object> item : items) {
                    Long menuId = ((Number) item.get("menuId")).longValue();
                    int qty = ((Number) item.get("quantity")).intValue();
                    Menu menu = menuMap.get(menuId);
                    if (menu != null) {
                        menuItems.add(new RecommendedMenuItem(menuId, menu.getName(), qty, menu.getPrice()));
                        total += menu.getPrice() * qty;
                    }
                }
                if (!menuItems.isEmpty()) {
                    results.add(new RecommendationResponse(name, menuItems, total));
                }
            }
            return results;
        } catch (Exception e) {
            log.error("OpenAI API call failed", e);
            throw new OpenAiApiException("Failed to get menu recommendations: " + e.getMessage());
        }
    }
}
