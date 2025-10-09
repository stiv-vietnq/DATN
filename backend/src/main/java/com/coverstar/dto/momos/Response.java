package com.coverstar.dto.momos;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Response {
    protected long responseTime;

    public long getResponseTime() {
        return  System.currentTimeMillis();
    }
    protected String message;

    private String partnerCode;
    private String orderId;
    protected Integer resultCode;

    public Response() {
        this.responseTime = System.currentTimeMillis();
    }

    public void setResponseTime(long responseTime) {
        this.responseTime = responseTime;
    }
}
