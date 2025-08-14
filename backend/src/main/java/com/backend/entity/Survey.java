package com.backend.entity;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Survey {
    private Long id;
    private String title;
    private String creatorName;
    private int questionCount;
    private boolean published;

    // 内部専用フィールド（DTOでは返さない想定）
    private String internalNotes;
    private LocalDateTime createdAt;

}