package com.devonfw.application.mtsj.usermanagement.common.api.to;

import com.devonfw.application.mtsj.general.common.api.to.AbstractSearchCriteriaTo;
import com.devonfw.module.basic.common.api.query.StringSearchConfigTo;

public class ResetLinkSearchCriteriaTo extends AbstractSearchCriteriaTo {
    
private static final long serialVersionUID = 1L;

  private Long userId;

  private String hashCode;

  private StringSearchConfigTo hashCodeOption;

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

  public String gethashCode() {

    return this.hashCode;
  }

  public void sethashCode(String hashCode) {

    this.hashCode = hashCode;
  }

  /**
   * @return hashCodeOption
   */
  public StringSearchConfigTo gethashCodeOption() {

    return this.hashCodeOption;
  }

  /**
   * @param linkOption new value of {@link #gethashCodeOption}.
   */
  public void sethashCodeOption(StringSearchConfigTo hashCodeOption) {

    this.hashCodeOption = hashCodeOption;
  }
}
