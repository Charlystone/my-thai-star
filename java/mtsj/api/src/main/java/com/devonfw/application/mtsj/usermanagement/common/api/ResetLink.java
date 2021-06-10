package com.devonfw.application.mtsj.usermanagement.common.api;

import com.devonfw.application.mtsj.general.common.api.ApplicationEntity;

public interface ResetLink extends ApplicationEntity {

    public Long getUserId();

    public void setUserId(Long userId);
    
    public String getToken();

    public void setToken(String token);
}
