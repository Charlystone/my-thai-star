package com.devonfw.application.mtsj.usermanagement.dataaccess.api.repo;

import com.devonfw.application.mtsj.usermanagement.common.api.to.ResetLinkSearchCriteriaTo;
import com.devonfw.application.mtsj.usermanagement.dataaccess.api.ResetLinkEntity;
import com.devonfw.module.jpa.dataaccess.api.QueryUtil;
import com.devonfw.module.jpa.dataaccess.api.data.DefaultRepository;
import com.mysema.query.alias.Alias;

import static com.querydsl.core.alias.Alias.$;
import com.querydsl.jpa.impl.JPAQuery;

import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

/**
 * {@link DefaultRepository} for {@link ResetLinkEntity}.
 */
public interface ResetLinkRepository extends DefaultRepository<ResetLinkEntity> {
    
    /**
   * @param criteria the {@link UserSearchCriteriaTo} with the criteria to search.
   * @return the {@link Page} of the {@link UserEntity} objects that matched the search.
   */
  default Page<ResetLinkEntity> findResetLinks(ResetLinkSearchCriteriaTo criteria) {

    ResetLinkEntity alias = newDslAlias();
    JPAQuery<ResetLinkEntity> query = newDslQuery(alias);

    String hashCode = criteria.gethashCode();
    if ((hashCode != null) && !hashCode.isEmpty()) {
      QueryUtil.get().whereString(query, $(alias.gethashCode()), hashCode, criteria.gethashCodeOption());
    }
    /*Long userId = criteria.getUserId();
    if (userId != null && alias.getUserId() != null) {
        query.where(Alias.$(alias.getUserId()).eq(userId));
    }*/

    return QueryUtil.get().findPaginated(criteria.getPageable(), query, false);
  }

  /**
   * @param hashCode
   * @return An {@link ResetLinkEntity} objects that matched the search.
   */
  @Query("SELECT PasswordResetLink FROM ResetLinkEntity PasswordResetLink" //
          + " WHERE PasswordResetLink.hashCode = :hashCode")
          ResetLinkEntity findByHashCode(@Param("hashCode") String hashCode);
}
