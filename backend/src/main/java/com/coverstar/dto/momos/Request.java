package com.coverstar.dto.momos;

import com.coverstar.constant.enums.Language;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class Request {
    private String partnerCode;
    private String requestId;
    private String orderId;
    private Language lang = Language.EN;
    private long startTime;
    public Request() {
        this.startTime = System.currentTimeMillis();
    }

    public Request(String partnerCode, String orderId, String requestId, Language lang) {
        this.partnerCode = partnerCode;
        this.orderId = orderId;
        this.requestId = requestId;
        this.lang = lang;
        this.startTime = System.currentTimeMillis();
    }
}
