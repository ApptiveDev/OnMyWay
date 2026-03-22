package _team.onmyway.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@NoArgsConstructor
@Getter
public class OAuthAccounts {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name="user_id", nullable = false)
    private Users user;

    @Enumerated(EnumType.STRING)
    private Provider provider;

    @Column(name="provider_user_id")
    private String providerUserId;

    public OAuthAccounts(Users user, Provider provider, String providerUserId) {
        this.user = user;
        this.provider = provider;
        this.providerUserId = providerUserId;
    }

    public enum Provider {
        KAKAO
    }
}
