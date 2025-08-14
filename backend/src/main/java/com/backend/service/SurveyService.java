package com.backend.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.backend.entity.Survey;

@Service
public class SurveyService {

    private final List<Survey> surveys = List.of(
        new Survey(1L, "朝の生活習慣アンケート", "Suzuki", 5, true, "社内限定のメモ", LocalDateTime.now().minusDays(3)),
        new Survey(2L, "開発生産性調査", "Tanaka", 12, false, "まだ下書き段階", LocalDateTime.now().minusDays(1)),
        new Survey(3L, "UI改善提案フォーム", "Sato", 8, true, "UXチーム共有事項あり", LocalDateTime.now().minusHours(6))
    );

    public List<Survey> findAll() {
        return surveys;
    }

    public Optional<Survey> findById(Long id) {
        return surveys.stream().filter(s -> s.getId().equals(id)).findFirst();
    }
}
