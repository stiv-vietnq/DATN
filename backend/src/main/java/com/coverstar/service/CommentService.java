package com.coverstar.service;

import com.coverstar.dto.CommentDto;
import com.coverstar.entity.Comment;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface CommentService {
    Comment createComment(CommentDto commentDto, List<MultipartFile> imageFiles) throws Exception;

    void deleteProduct(Long id);
}