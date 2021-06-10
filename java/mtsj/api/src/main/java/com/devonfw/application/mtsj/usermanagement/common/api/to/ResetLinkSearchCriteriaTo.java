package com.devonfw.application.mtsj.usermanagement.common.api.to;

import com.devonfw.application.mtsj.general.common.api.to.AbstractSearchCriteriaTo;
import com.devonfw.module.basic.common.api.query.StringSearchConfigTo;

public class ResetLinkSearchCriteriaTo extends AbstractSearchCriteriaTo {
    
private static final long serialVersionUID = 1L;

  private Long userId;

  private String token;

  private StringSearchConfigTo tokenOption;

  /**
   * The constructor.
   */
  public ResetLinkSearchCriteriaTo() {

    super();
  }

  public Long getUserId() {

    return this.userId;
  }

  public void setUserId(Long userId) {

    this.userId = userId;
  }

  public String getToken() {

    return this.token;
  }

  public void setToken(String token) {

    this.token = token;
  }

  /**
   * @return hashCodeOption
   */
  public StringSearchConfigTo getTokenOption() {

    return this.tokenOption;
  }

  /**
   * @param tokenOption new value of {@link #getTokenOption}.
   */
  public void sethashCodeOption(StringSearchConfigTo tokenOption) {

    this.tokenOption = tokenOption;
  }
}
