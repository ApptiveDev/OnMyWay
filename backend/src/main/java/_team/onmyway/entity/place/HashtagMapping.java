package _team.onmyway.entity.place;

import _team.onmyway.entity.hashtag.HashTags;
import jakarta.persistence.*;
import lombok.Getter;

@Entity
@Getter
public class HashtagMapping {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne
    @JoinColumn(name = "place_id")
    private Place place;

    @ManyToOne
    @JoinColumn(name="hashtags_id")
    private HashTags hashTag;
}
