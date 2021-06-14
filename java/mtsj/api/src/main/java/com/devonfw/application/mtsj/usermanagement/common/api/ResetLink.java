package com.devonfw.application.mtsj.usermanagement.common.api;

import java.util.Date;

import com.devonfw.application.mtsj.general.common.api.ApplicationEntity;

public interface ResetLink extends ApplicationEntity {

    public Date getExpirationDate();

    public void setExpirationDate(Date expirationDate);
    
    public String getToken();

    public void setToken(String token);
}
