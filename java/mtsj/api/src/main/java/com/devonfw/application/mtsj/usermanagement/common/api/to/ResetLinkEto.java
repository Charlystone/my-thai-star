package com.devonfw.application.mtsj.usermanagement.common.api.to;

import java.util.Date;

import com.devonfw.application.mtsj.usermanagement.common.api.ResetLink;
import com.devonfw.module.basic.common.api.to.AbstractEto;

public class ResetLinkEto extends AbstractEto implements ResetLink {

    private static final long serialVersionUID = 1L;

    private Date expirationDate;

    private String token;

    @Override
    public Date getExpirationDate() {

        return this.expirationDate;
    }

    @Override
    public void setExpirationDate(Date expirationDate) {

        this.expirationDate = expirationDate;
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
