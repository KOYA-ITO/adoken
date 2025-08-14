package com.backend.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.backend.dto.SurveyDetailDto;
import com.backend.dto.SurveyListItemDto;
import com.backend.service.SurveyService;

@RestController
@RequestMapping("/api/surveys")
@CrossOrigin(origins = "http://localhost:3000") // 開発時: Next.js Dev Server を許可
public class SurveyController {

    private final SurveyService service;

    public SurveyController(SurveyService service) {
        this.service = service;
    }

    @GetMapping
    public List<SurveyListItemDto> list() {
        return service.findAll().stream()
            .map(s -> new SurveyListItemDto(
                s.getId(),
                s.getTitle(),
                s.getCreatorName(),
                s.getQuestionCount(),
                s.isPublished()
            ))
            .toList();
    }

    @GetMapping("/{id}")
    public SurveyDetailDto detail(@PathVariable Long id) {
        var s = service.findById(id).orElseThrow(() -> new IllegalArgumentException("not found: " + id));
        return new SurveyDetailDto(
            s.getId(),
            s.getTitle(),
            s.getCreatorName(),
            s.getQuestionCount(),
            s.isPublished(),
            s.getCreatedAt()
        );
    }
}
