package com.portfolio.server.service.impl;

import com.portfolio.server.dto.request.TranslateRequest;
import com.portfolio.server.dto.response.TranslateResponse;
import com.portfolio.server.service.TranslationService;
import com.portfolio.server.service.client.GeminiClient;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class TranslationServiceImpl implements TranslationService {

    private final GeminiClient geminiClient;

    @Override
    public TranslateResponse translate(TranslateRequest request) {
        String sourceLang = (request.getSourceLang() != null && !request.getSourceLang().isBlank())
                ? request.getSourceLang().trim().toLowerCase()
                : "vi";
        String targetLang = request.getTargetLang().trim().toLowerCase();
        String textToTranslate = request.getText().trim();

        String sourceLangName = getLanguageName(sourceLang);
        String targetLangName = getLanguageName(targetLang);

        String systemInstruction = String.format(
                "You are an expert translator specializing in Software Engineering, Developer Resumes, and IT Portfolios.\n" +
                "Your sole task is to translate input text from %s into %s.\n\n" +
                "STRICT RULES:\n" +
                "1. [MANDATORY OUTPUT LANGUAGE] The final response MUST be strictly in %s. NEVER return the text in the source language (%s).\n" +
                "2. [TYPO & SPELLING CORRECTION] If the source text contains typos, misspellings, slangs, or informal phrasing (for example, 'Xing chào' -> 'Hello', 'Lập chình viên' -> 'Software Engineer', 'Fontend' -> 'Frontend'), intelligently understand the intended meaning and translate that intended meaning directly into %s. DO NOT simply output the corrected text in %s.\n" +
                "3. [TECHNICAL TERMS] Keep standard international software engineering terminology, library names, tool names, and programming languages in standard English (e.g., Java, Spring Boot, React, Docker, Kubernetes, CI/CD, RESTful API, PostgreSQL, Redis, AWS, Git, etc.).\n" +
                "4. [PRESERVE FORMATTING] Preserve all original formatting, line breaks, bullet points, numbers, and markdown elements.\n" +
                "5. [CLEAN OUTPUT ONLY] Output ONLY the translated text. Do NOT include greetings, conversational preamble, explanations, markdown code blocks, or quotation marks.",
                sourceLangName, targetLangName,
                targetLangName, sourceLangName,
                targetLangName, sourceLangName
        );

        StringBuilder promptBuilder = new StringBuilder();
        if (request.getContext() != null && !request.getContext().isBlank()) {
            promptBuilder.append(String.format("Context: %s\n\n", request.getContext().trim()));
        }
        promptBuilder.append(String.format("Text to translate from %s to %s:\n", sourceLangName, targetLangName));
        promptBuilder.append(textToTranslate);

        log.info("Requesting Gemini translation from {} ({}) to {} ({})", sourceLang, sourceLangName, targetLang, targetLangName);
        String translatedText = geminiClient.generateContent(promptBuilder.toString(), systemInstruction);

        return TranslateResponse.builder()
                .translatedText(translatedText)
                .sourceLang(sourceLang)
                .targetLang(targetLang)
                .build();
    }

    private String getLanguageName(String code) {
        return switch (code.toLowerCase()) {
            case "vi" -> "Vietnamese";
            case "en" -> "English";
            case "ja" -> "Japanese";
            case "ko" -> "Korean";
            case "zh" -> "Chinese";
            case "fr" -> "French";
            case "de" -> "German";
            default -> code;
        };
    }
}
