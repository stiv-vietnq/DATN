package com.coverstar.dto.momos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class HttpRequest {
    private String method;
    private String endpoint;
    private String payload;
    private String contentType;
}
