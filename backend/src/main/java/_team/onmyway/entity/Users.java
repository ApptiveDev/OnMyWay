package _team.onmyway.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
public class Users {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nickname;

    private String email;

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private Profile profile;
//    @Column(name = "profile_image_url")
//    private String profileImageUrl;

    @Enumerated(EnumType.STRING)
    private Role role;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private Status status = Status.PENDING;

    @CreationTimestamp
    @Column(name="created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name="updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "is_active")
    @Builder.Default
    private Boolean isActive = true;

    @Column(name = "refresh_token")
    private String refreshToken;

    public void setProfile(Profile profile) {
        this.profile = profile;
    }

    public void updateProfile(String nickname, String email) {
        this.nickname = nickname;
        this.email = email;
        //this.profileImageUrl = profileImageUrl;
        // this.isActive = true; // status 필드로 대체 고려
    }

    public void completeSignup(String nickname) {
        this.nickname = nickname;
        this.status = Status.ACTIVE;
    }

    public void updateRefreshToken(String refreshToken) {
        this.refreshToken = refreshToken;
    }

    public void deactivate() {
        this.isActive = false;
    }

    public enum Role {
        USER,
        ADMIN
    }

    public enum Status {
        PENDING,
        ACTIVE
    }
}
