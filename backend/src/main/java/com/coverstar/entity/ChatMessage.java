package com.coverstar.entity;

import com.coverstar.constant.enums.Status;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@NoArgsConstructor
@Entity
@Getter
@Setter
@Table(name = "CHAT_MESSAGES")
public class ChatMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String senderName;
    private String receiverName;
    @Column(length = 1000)
    private String message;
    @Column(length = 1000)
    private String media;
    @Column(length = 1000)
    private String mediaType;
    @Enumerated(EnumType.STRING)
    private Status status;
    @Column(nullable = false)
    private Long timestamp;

    public ChatMessage(String senderName, String receiverName, String message, String media, String mediaType, Status status, Long timestamp) {
        this.senderName = senderName;
        this.receiverName = receiverName;
        this.message = message;
        this.media = media;
        this.mediaType = mediaType;
        this.status = status;
        this.timestamp = timestamp;
    }
}
