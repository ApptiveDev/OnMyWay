package _team.onmyway.repository;

import _team.onmyway.entity.user.OAuthAccounts;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OAuthAccountsRepository extends JpaRepository<OAuthAccounts, Long> {
    OAuthAccounts findByProviderAndProviderUserId(OAuthAccounts.Provider provider, String providerUserId);
}
