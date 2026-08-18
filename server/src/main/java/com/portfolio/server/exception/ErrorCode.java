package com.portfolio.server.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
@AllArgsConstructor
public enum ErrorCode {
    ACCOUNT_EXISTED(1001, "Account already existed", HttpStatus.CONFLICT),
    ACCOUNT_NOT_FOUND(1002, "Account not found", HttpStatus.NOT_FOUND),
    INVALID_CREDENTIALS(1003, "Invalid username or password", HttpStatus.UNAUTHORIZED),
    UNAUTHENTICATED(1004, "Authentication is required", HttpStatus.UNAUTHORIZED),
    ACCESS_DENIED(1005, "Access denied", HttpStatus.FORBIDDEN),
    ROLE_NOT_FOUND(1006, "Default role not found", HttpStatus.INTERNAL_SERVER_ERROR),
    PERSONAL_INFO_NOT_FOUND(2001, "Personal info not found", HttpStatus.NOT_FOUND),
    INVALID_LANGUAGE(2002, "Invalid language. Accepted values: vi, en", HttpStatus.BAD_REQUEST),
    ABOUT_NOT_FOUND(2003, "About detail not found", HttpStatus.NOT_FOUND),
    SKILL_NOT_FOUND(2004, "Skill not found", HttpStatus.NOT_FOUND),
    PROJECT_NOT_FOUND(2005, "Project not found", HttpStatus.NOT_FOUND),
    FILE_EMPTY(3001, "File cannot be empty", HttpStatus.BAD_REQUEST),
    INVALID_FILE_TYPE(3002, "Invalid file type. Only PDF files are allowed", HttpStatus.BAD_REQUEST),
    FILE_UPLOAD_FAILED(3003, "Failed to upload file to Cloudinary", HttpStatus.INTERNAL_SERVER_ERROR),
    INVALID_IMAGE_TYPE(3004, "Invalid image format. Supported formats: JPG, JPEG, PNG, WEBP, GIF, SVG", HttpStatus.BAD_REQUEST),
    GEMINI_API_KEY_MISSING(4001, "Gemini API key is not configured", HttpStatus.INTERNAL_SERVER_ERROR),
    TRANSLATION_FAILED(4002, "Failed to translate text with Gemini LLM", HttpStatus.BAD_GATEWAY),
    GEMINI_QUOTA_EXCEEDED(4003, "Gemini API quota exceeded or rate limited", HttpStatus.TOO_MANY_REQUESTS),
    UNCATEGORIZED(9999, "Uncategorized error", HttpStatus.INTERNAL_SERVER_ERROR);

    private final int code;
    private final String message;
    private final HttpStatus httpStatus;
}
