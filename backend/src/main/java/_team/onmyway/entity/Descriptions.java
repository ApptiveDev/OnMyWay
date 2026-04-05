package _team.onmyway.entity;

import jakarta.persistence.*;

@Entity
public class Descriptions {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name="place_id", nullable = false)
    private Place place;

    private String description;
}
