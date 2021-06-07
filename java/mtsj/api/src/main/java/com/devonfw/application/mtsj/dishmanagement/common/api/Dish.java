package com.devonfw.application.mtsj.dishmanagement.common.api;

import java.math.BigDecimal;

import com.devonfw.application.mtsj.general.common.api.ApplicationEntity;

public interface Dish extends ApplicationEntity {

  public boolean getIsDishOfTheDay();

  public void setIsDishOfTheDay(boolean isDishOfTheDay);

  public String getName();

  public void setName(String name);

  public String getDescription();

  public void setDescription(String description);

  public BigDecimal getPrice();

  public void setPrice(BigDecimal price);

  public Long getImageId();

  public void setImageId(Long idImage);

}
