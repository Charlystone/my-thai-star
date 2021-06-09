package com.devonfw.application.mtsj.usermanagement.common.api.to;

import com.devonfw.application.mtsj.general.common.api.to.AbstractSearchCriteriaTo;
import com.devonfw.module.basic.common.api.query.StringSearchConfigTo;

public class ResetLinkSearchCriteriaTo extends AbstractSearchCriteriaTo {
    
private static final long serialVersionUID = 1L;

  private Long userId;

  private String link;

  private StringSearchConfigTo linkOption;

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

  public String getLink() {

    return this.link;
  }

  public void setLink(String link) {

    this.link = link;
  }

  /**
   * @return linkOption
   */
  public StringSearchConfigTo getLinkOption() {

    return this.linkOption;
  }

  /**
   * @param linkOption new value of {@link #getLinkOption}.
   */
  public void setLinkOption(StringSearchConfigTo linkOption) {

    this.linkOption = linkOption;
  }
}
