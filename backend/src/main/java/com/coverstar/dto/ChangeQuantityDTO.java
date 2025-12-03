package com.coverstar.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ChangeQuantityDTO implements Serializable {
    private static final long serialVersionUID = 929647868727222720L;

    private Long quantity;
    private String total;

}
