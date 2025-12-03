package com.coverstar.repository;

import com.coverstar.entity.ChatbotKeyword;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatbotKeywordRepository extends JpaRepository<ChatbotKeyword, Long> {

    List<ChatbotKeyword> findByKeywordContainingIgnoreCase(String keyword);
}
