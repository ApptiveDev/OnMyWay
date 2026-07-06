package _team.onmyway.entity;

import jakarta.persistence.*;

@Entity
public class LikePlace {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "users_id")
    private Users user;

    @ManyToOne
    @JoinColumn(name = "place_id")
    private Place place;
}
