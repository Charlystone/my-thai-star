package com.devonfw.application.mtsj.usermanagement.dataaccess.api;

import java.util.Date;
import java.util.List;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.persistence.Transient;

import com.devonfw.application.mtsj.bookingmanagement.dataaccess.api.BookingEntity;
import com.devonfw.application.mtsj.dishmanagement.dataaccess.api.DishEntity;
import com.devonfw.application.mtsj.general.dataaccess.api.ApplicationPersistenceEntity;
import com.devonfw.application.mtsj.usermanagement.common.api.ResetLink;
import com.devonfw.application.mtsj.usermanagement.common.api.User;

@Entity
@Table(name = "PasswordResetLink")
public class ResetLinkEntity extends ApplicationPersistenceEntity implements ResetLink {

private String token;

private Date expirationDate;

/**
 * @return userId
 */
@Override
public Date getExpirationDate() {

    return this.expirationDate;
}

/**
 * @param expirationDate new value of {@link #getExpirationDate()}.
 */
@Override
public void setExpirationDate(Date expirationDate) {

    this.expirationDate = expirationDate;
}

/**
 * @return link
 */
@Override
public String getToken() {
    
    return this.token;
}

/**
 * @param token new value of {@link #getToken()}.
 */
@Override
public void setToken(String token) {
    
    this.token = token;
}
}
