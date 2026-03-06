package _team.onmyway.repository;

import _team.onmyway.entity.OAuthAccounts;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OAuthAccountsRepository extends JpaRepository<OAuthAccounts, Long> {
    public OAuthAccounts findByProviderAndProviderUserId(String provider, String providerUserId);
}
