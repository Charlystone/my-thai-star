package com.devonfw.application.mtsj.usermanagement.common.api.to;

import java.util.Date;

import com.devonfw.application.mtsj.general.common.api.to.AbstractSearchCriteriaTo;
import com.devonfw.module.basic.common.api.query.StringSearchConfigTo;

public class ResetLinkSearchCriteriaTo extends AbstractSearchCriteriaTo {
    
private static final long serialVersionUID = 1L;

  private Date expirationDate;

  private String token;

  private StringSearchConfigTo tokenOption;

  /**
   * The constructor.
   */
  public ResetLinkSearchCriteriaTo() {

    super();
  }

  public Date getExpirationDate() {

    return this.expirationDate;
  }

  public void setExpirationDate(Date expirationDate) {

    this.expirationDate = expirationDate;
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
