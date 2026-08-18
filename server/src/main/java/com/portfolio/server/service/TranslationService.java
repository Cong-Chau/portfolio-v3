package com.portfolio.server.service;

import com.portfolio.server.dto.request.TranslateRequest;
import com.portfolio.server.dto.response.TranslateResponse;

public interface TranslationService {
    TranslateResponse translate(TranslateRequest request);
}
