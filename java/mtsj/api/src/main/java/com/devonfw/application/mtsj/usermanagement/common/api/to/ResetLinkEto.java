package com.devonfw.application.mtsj.usermanagement.common.api.to;

import com.devonfw.application.mtsj.usermanagement.common.api.ResetLink;
import com.devonfw.module.basic.common.api.to.AbstractEto;

public class ResetLinkEto extends AbstractEto implements ResetLink {

    private static final long serialVersionUID = 1L;

    private Long userId;

    private String token;

    @Override
    public Long getUserId() {

        return this.userId;
    }

    @Override
    public void setUserId(Long userId) {
        
        this.userId = userId;
    }

    @Override
    public String getToken() {
        
        return this.token;
    }

    @Override
    public void setToken(String token) {
        
        this.token = token;
    }
    
}
