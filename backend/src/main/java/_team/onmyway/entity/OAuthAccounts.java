package _team.onmyway.entity;

import jakarta.persistence.*;
import lombok.NoArgsConstructor;

@Entity
@NoArgsConstructor
@Table(schema = "onmyway")
public class OAuthAccounts {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name="user_id")
    private Users user;

    private String provider;

    @Column(name="provider_user_id")
    private String providerUserId;

    public OAuthAccounts(Users user, String provider, String providerUserId) {
        this.user = user;
        this.provider = provider;
        this.providerUserId = providerUserId;
    }

    public Users getUser() {
        return user;
    }
}
