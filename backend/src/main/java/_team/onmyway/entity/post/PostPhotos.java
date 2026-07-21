package _team.onmyway.entity.post;

import jakarta.persistence.*;
import lombok.Getter;

@Entity
@Getter
public class PostPhotos {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name="posts_id")
    private Posts post;

    private String photo;
}
