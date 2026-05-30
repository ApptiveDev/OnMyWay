package _team.onmyway.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class Profile {
    @Id
    private Long id;

    @MapsId
    @OneToOne
    @JoinColumn(name="users_id")
    private Users user;

    private String profileName;

    private String catchPhrase;

    private String imageURL;

    private LocalDateTime updatedAt;

    @Builder
    public Profile(Users user, String profileName, String catchPhrase, String imageURL, LocalDateTime updatedAt) {
        this.user = user;
        this.profileName = profileName;
        this.catchPhrase = catchPhrase;
        this.imageURL = imageURL;
        this.updatedAt = updatedAt;
    }

    public void updateProfile(String imageURL, String profileName) {
        this.imageURL = imageURL;
        this.profileName = profileName;
        this.updatedAt = LocalDateTime.now();
    }

    public void updateCatchPhrase(String catchPhrase) {
        this.catchPhrase = catchPhrase;
    }

    public void updateProfileImage(String imageURL) {
        this.imageURL = imageURL;
        this.updatedAt = LocalDateTime.now();
    }
}
