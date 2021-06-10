package com.devonfw.application.mtsj.usermanagement;

import javax.inject.Inject;

import org.checkerframework.common.reflection.qual.Invoke;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import com.devonfw.application.mtsj.SpringBootApp;
import com.devonfw.application.mtsj.general.common.ApplicationComponentTest;
import com.devonfw.application.mtsj.usermanagement.logic.api.Usermanagement;
import com.devonfw.application.mtsj.usermanagement.common.api.to.UserEto;

/**
 * Test for {@link Usermanagement}
 */
@SpringBootTest(classes = SpringBootApp.class)

public class UsermanagementTest extends ApplicationComponentTest {

    @Inject 
    private Usermanagement userManagement;

    private UserEto userEto1;
    private UserEto userEto2;

    @Override
    public void doSetUp() {
        // some user
        this.userEto1 = new UserEto();
        this.userEto1.setEmail("testMail1@mail.com");
        this.userEto1.setUsername("testUser1");
        this.userEto1.setPassword("password1");
        this.userEto1.setUserRoleId(1L);

        // another user
        this.userEto2 = new UserEto();
        this.userEto2.setEmail("testMail2@mail.com");
        this.userEto2.setUsername("testUser2");
        this.userEto2.setPassword("password2");
        this.userEto2.setUserRoleId(1L);
    }

    @Test
    public void saveNewUser() {
        assertThat(this.userManagement.saveUser(this.userEto1)).isNotNull();
    }

    @Test
    public void noDuplicateSaves() {
        UserEto createdUser = this.userManagement.saveUser(this.userEto1);
        assertThat(this.userManagement.saveUser(this.userEto1)).isEqualTo(createdUser);
    }

    @Test
    public void editUser() {
        UserEto createdUser = this.userManagement.saveUser(this.userEto1);
        createdUser.setEmail("testMail2@mail.com");
        createdUser.setUsername("testUser2");
        createdUser.setPassword("password2");
        assertThat(this.userManagement.saveUser(this.userEto2).getEmail()).isEqualTo(createdUser.getEmail());
        assertThat(this.userManagement.saveUser(this.userEto2).getUsername()).isEqualTo(createdUser.getUsername());
        assertThat(this.userManagement.saveUser(this.userEto2).getPassword()).isEqualTo(createdUser.getPassword());
    }
}
