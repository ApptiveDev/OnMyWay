package _team.onmyway.entity;

import jakarta.persistence.*;
import lombok.Getter;

@Entity
@Getter
public class StopOver {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne
    @JoinColumn(name = "route_id")
    private Route route;

    private int visit_order;

    private Double stop_lat;
    private Double stop_lon;
}
