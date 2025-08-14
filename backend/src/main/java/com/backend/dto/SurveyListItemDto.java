package com.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SurveyListItemDto {
	
    private Long id;
    private String title;
    private String creatorName;
    private int questionCount;
    private boolean published;

}
