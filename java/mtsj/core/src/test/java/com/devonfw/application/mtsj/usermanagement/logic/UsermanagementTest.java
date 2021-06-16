package com.devonfw.application.mtsj.usermanagement.logic;

import javax.inject.Inject;

import org.aspectj.lang.annotation.Before;
import org.checkerframework.common.reflection.qual.Invoke;
import org.junit.jupiter.api.Order;
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
    private Usermanagement usermanagement;

    private UserEto userEto1;
    private UserEto userEto2;

    @Override
    public void doSetUp() {
        super.doSetUp();
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

    /**
     * tests whether a user that does not yet exist can be created
     * and then tests if user can be deleted properly
     */
    @Test
    public void userLifeCycle() {
        //make sure user doesn't already exist
        assertThat(this.usermanagement.findUserbyName(this.userEto1.getUsername())).isNull();
        //save new user
        UserEto createdUser = this.usermanagement.saveUser(this.userEto1);
        //make sure user has been created
        assertThat(createdUser).isNotNull();
        
        //delete user
        this.usermanagement.deleteUser(createdUser.getId());
        //make sure user does not exist anymore 
        createdUser = this.usermanagement.findUserbyName(this.userEto1.getUsername());
        assertThat(createdUser).isNull();
    }

    @Test
    public void editUser() {
        UserEto createdUser = this.usermanagement.saveUser(this.userEto1);
        createdUser.setPassword("passwordtest");
        assertThat(createdUser.getPassword()).
            isNotEqualTo(this.usermanagement.
            findUserbyName(this.userEto1.getUsername()).getPassword());
        this.usermanagement.deleteUser(createdUser.getId());
    }

    @Test
    public void passwordIsCorrectlyEncrypted() {
        UserEto createdUser = this.usermanagement.saveUser(this.userEto1);
        assertThat(createdUser.getPassword()).isNotEqualTo(this.userEto1.getPassword());
        this.usermanagement.deleteUser(createdUser.getId());
    }

    @Test
    public void mailIsSent() {
        UserEto createdUser = this.usermanagement.saveUser(this.userEto2);
        assertThat(this.usermanagement.sendPasswordResetLink(createdUser)).isTrue();
        assertThat(this.usermanagement.sendPasswordResetLink(null)).isFalse();
        this.usermanagement.deleteUser(createdUser.getId());
    }

    @Test
    public void checkExpirationDateOfLink() {
        
    }

    

    @Test
    public void stringsAreProperlyShuffled() {
        String teststring = this.usermanagement.shuffleString("test");
        assertThat(teststring).isNotEqualTo("test");
    }
   
}
