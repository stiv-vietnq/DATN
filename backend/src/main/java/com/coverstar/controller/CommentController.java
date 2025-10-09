package com.coverstar.controller;

import com.coverstar.constant.Constants;
import com.coverstar.dto.CommentDto;
import com.coverstar.entity.Comment;
import com.coverstar.service.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Objects;

@RestController
@RequestMapping("/comments")
public class CommentController {

    @Autowired
    private CommentService commentService;

    @PostMapping("/createComment")
    public ResponseEntity<?> createComment(@RequestParam("productId") Long productId,
                                           @RequestParam("userId") Long userId,
                                           @RequestParam("description") String description,
                                           @RequestParam("evaluate") Integer evaluate,
                                           @RequestParam("evaluateProduct") Integer evaluateProduct,
                                           @RequestParam("file") List<MultipartFile> imageFiles) {
        if (Objects.isNull(productId) || Objects.isNull(userId) || Objects.isNull(description) ||
                Objects.isNull(evaluate) || Objects.isNull(evaluateProduct) || Objects.isNull(imageFiles)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("One or more required fields are null");
        }
        try {
            CommentDto commentDto = new CommentDto(productId, userId, description, evaluate, evaluateProduct);
            Comment comment = commentService.createComment(commentDto, imageFiles);
            return ResponseEntity.ok(comment);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Constants.ERROR);
        }
    }

    @PostMapping("/deleteProduct/{id}")
    public ResponseEntity<?> deleteComment(@PathVariable Long id) {
        try {
            commentService.deleteProduct(id);
            return ResponseEntity.ok(HttpStatus.OK);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Constants.ERROR);
        }
    }
}