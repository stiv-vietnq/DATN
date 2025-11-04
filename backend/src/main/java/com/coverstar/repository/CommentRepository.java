package com.coverstar.repository;

import com.coverstar.entity.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Set;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {

    @Query("SELECT c " +
            "FROM Comment c " +
            "INNER JOIN Image i ON c.id = i.commentId " +
            "WHERE c.productId = :id " +
            "AND i.type = 2 " +
            "ORDER BY c.id ASC")
    Set<Comment> findCommentById(String id);

    @Query("SELECT c " +
            "FROM Comment c " +
            "INNER JOIN Image i ON c.id = i.commentId " +
            "WHERE c.id = :id " +
            "AND i.type = 2 " +
            "ORDER BY c.id ASC")
    Comment getCommentById(Long id);
}
