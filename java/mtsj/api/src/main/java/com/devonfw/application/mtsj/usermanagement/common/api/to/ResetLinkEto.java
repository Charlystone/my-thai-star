package com.devonfw.application.mtsj.usermanagement.common.api.to;

import com.devonfw.application.mtsj.usermanagement.common.api.ResetLink;
import com.devonfw.module.basic.common.api.to.AbstractEto;

public class ResetLinkEto extends AbstractEto implements ResetLink {

    private static final long serialVersionUID = 1L;

    private Long userId;

    private String hashCode;

    @Override
    public Long getUserId() {

        return this.userId;
    }

    @Override
    public void setUserId(Long userId) {
        
        this.userId = userId;
    }

    @Override
    public String gethashCode() {
        
        return this.hashCode;
    }

    @Override
    public void sethashCode(String hashCode) {
        
        this.hashCode = hashCode;
    }
    
}
