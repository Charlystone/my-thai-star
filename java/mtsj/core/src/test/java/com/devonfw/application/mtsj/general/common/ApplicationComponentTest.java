package com.devonfw.application.mtsj.general.common;

import com.devonfw.application.mtsj.general.common.impl.security.ApplicationAccessControlConfig;
import com.devonfw.module.test.common.base.ComponentTest;

import org.aspectj.lang.annotation.Before;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;

/**
 * This class provides login with admin permissions and logout for component tests.
 */
public abstract class ApplicationComponentTest extends ComponentTest {

  @Override
  @BeforeAll
  protected void doSetUp() {

    TestUtil.login("admin", ApplicationAccessControlConfig.GROUP_ADMIN);
  }

  @Override
  protected void doTearDown() {

    TestUtil.logout();
  }

}
