package _team.onmyway.entity.post;

import _team.onmyway.entity.user.Users;
import jakarta.persistence.*;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
public class Posts {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    private String content;

    @ManyToOne
    @JoinColumn(name="users_id")
    private Users author;

    @OneToMany(mappedBy = "post")
    private List<PostPhotos> photos = new ArrayList<PostPhotos>();

    private LocalDateTime created = LocalDateTime.now();

    private LocalDateTime modified = LocalDateTime.now();
}
