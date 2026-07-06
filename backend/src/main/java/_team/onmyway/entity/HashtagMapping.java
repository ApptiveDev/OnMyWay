package _team.onmyway.entity;

import jakarta.persistence.*;
import lombok.Getter;
import org.hibernate.mapping.Join;

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
