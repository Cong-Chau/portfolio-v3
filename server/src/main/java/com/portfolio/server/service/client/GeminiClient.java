package com.portfolio.server.service.client;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.portfolio.server.configuration.GeminiConfig;
import com.portfolio.server.exception.AppException;
import com.portfolio.server.exception.ErrorCode;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientResponseException;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Component
@RequiredArgsConstructor
public class GeminiClient {

    private final RestClient geminiRestClient;
    private final GeminiConfig geminiConfig;

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class GeminiResponse {
        // Hỗ trợ endpoint /interactions
        @JsonProperty("output_text")
        private String outputText;

        // Hỗ trợ endpoint /models/...:generateContent
        private List<Candidate> candidates;

        @Data
        @JsonIgnoreProperties(ignoreUnknown = true)
        public static class Candidate {
            private Content content;
        }

        @Data
        @JsonIgnoreProperties(ignoreUnknown = true)
        public static class Content {
            private List<Part> parts;
        }

        @Data
        @JsonIgnoreProperties(ignoreUnknown = true)
        public static class Part {
            private String text;
        }

        public String extractResultText() {
            if (outputText != null && !outputText.isBlank()) {
                return outputText.trim();
            }
            if (candidates != null && !candidates.isEmpty() && candidates.getFirst().getContent() != null) {
                var parts = candidates.getFirst().getContent().getParts();
                if (parts != null && !parts.isEmpty() && parts.getFirst().getText() != null) {
                    return parts.getFirst().getText().trim();
                }
            }
            return "";
        }
    }

    public String generateContent(String prompt) {
        return generateContent(prompt, null);
    }

    public String generateContent(String prompt, String systemInstruction) {
        String apiKey = geminiConfig.getApiKey();
        if (apiKey == null || apiKey.trim().isEmpty() || "your_gemini_api_key".equalsIgnoreCase(apiKey.trim())) {
            log.error("Gemini API key is not configured in application properties/environment");
            throw new AppException(ErrorCode.GEMINI_API_KEY_MISSING);
        }

        String cleanKey = apiKey.trim();
        String rawApiUrl = geminiConfig.getApiUrl() != null ? geminiConfig.getApiUrl().trim() : "";
        boolean isInteractionsApi = rawApiUrl.contains("interactions");

        String url;
        Map<String, Object> requestBody = new HashMap<>();

        if (isInteractionsApi) {
            // Endpoint dạng: https://generativelanguage.googleapis.com/v1beta/interactions
            url = String.format("%s?key=%s", rawApiUrl.replaceAll("/+$", ""), cleanKey);
            requestBody.put("model", geminiConfig.getModel());
            requestBody.put("input", prompt);
            if (systemInstruction != null && !systemInstruction.isBlank()) {
                requestBody.put("system_instruction", systemInstruction.trim());
            }
        } else {
            // Endpoint dạng: https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent
            url = String.format("%s/%s:generateContent?key=%s",
                    rawApiUrl.replaceAll("/+$", ""),
                    geminiConfig.getModel(),
                    cleanKey
            );
            requestBody.put("contents", List.of(
                    Map.of("parts", List.of(Map.of("text", prompt)))
            ));
            requestBody.put("generationConfig", Map.of(
                    "temperature", 0.2
            ));

            if (systemInstruction != null && !systemInstruction.isBlank()) {
                requestBody.put("system_instruction", Map.of(
                        "parts", List.of(Map.of("text", systemInstruction.trim()))
                ));
            }
        }

        try {
            GeminiResponse response = geminiRestClient.post()
                    .uri(url)
                    .header("x-goog-api-key", cleanKey)
                    .contentType(MediaType.APPLICATION_JSON)
                    .accept(MediaType.APPLICATION_JSON)
                    .body(requestBody)
                    .retrieve()
                    .body(GeminiResponse.class);

            if (response == null) {
                log.error("Empty response returned from Gemini API");
                throw new AppException(ErrorCode.TRANSLATION_FAILED);
            }

            String resultText = response.extractResultText();
            if (resultText.isEmpty()) {
                log.error("Could not extract result text from Gemini response");
                throw new AppException(ErrorCode.TRANSLATION_FAILED);
            }

            return resultText;

        } catch (HttpClientErrorException.TooManyRequests e) {
            log.error("Gemini API quota exceeded or rate limit hit: {}", e.getMessage());
            throw new AppException(ErrorCode.GEMINI_QUOTA_EXCEEDED);
        } catch (RestClientResponseException e) {
            log.error("Gemini API error (HTTP {}): {}", e.getStatusCode(), e.getResponseBodyAsString());
            if (e.getStatusCode() == HttpStatus.TOO_MANY_REQUESTS) {
                throw new AppException(ErrorCode.GEMINI_QUOTA_EXCEEDED);
            }
            throw new AppException(ErrorCode.TRANSLATION_FAILED);
        } catch (AppException e) {
            throw e;
        } catch (Exception e) {
            log.error("Unexpected error occurred while calling Gemini API: {}", e.getMessage(), e);
            throw new AppException(ErrorCode.TRANSLATION_FAILED);
        }
    }
}
