package com.backend.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SurveyDetailDto {
    private Long id;
    private String title;
    private String creatorName;
    private int questionCount;
    private boolean published;
    private LocalDateTime createdAt;
    // internalNotes は返さない：サーバ内の機微情報という想定
}
