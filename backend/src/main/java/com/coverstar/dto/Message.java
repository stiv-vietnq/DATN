package com.coverstar.dto;


import com.coverstar.constant.enums.Status;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
public class Message {

    private String senderName;
    private String receiverName;
    private String message;
    private String media;
    private Status status;
    private String mediaType;
}
