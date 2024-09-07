package com.example.E_stack.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AllQuestionResponseDto {
    private List<QuestionDTO> questionDTOList;
    private Integer totalPages;
    private Integer pageNumber; //Current page
}
