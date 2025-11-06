package com.coverstar.service;

import com.coverstar.dto.CommentDto;
import com.coverstar.entity.Comment;

public interface CommentService {
    Comment createComment(CommentDto commentDto) throws Exception;

    void deleteProduct(Long id);
}