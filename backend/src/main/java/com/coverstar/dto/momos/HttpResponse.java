package com.coverstar.dto.momos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import okhttp3.Headers;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class HttpResponse {

    int status;
    String data;
    Headers headers;
}
