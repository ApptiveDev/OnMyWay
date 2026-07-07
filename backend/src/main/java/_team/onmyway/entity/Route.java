package _team.onmyway.entity;

import jakarta.persistence.*;
import lombok.Getter;
import org.hibernate.annotations.BatchSize;

import java.util.List;

@Entity
@Getter
public class Route {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "users_id")
    private Users user;

    private RouteType routeType;

    private String startName;
    private Double startLat;
    private Double startLon;

    private String endName;
    private Double endLat;
    private Double endLon;

    private Double distance;

    private Integer time;

    @BatchSize(size = 100)
    @OneToMany(mappedBy = "route", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<RoutePlace> routePlaces;

    @BatchSize(size = 100)
    @OneToMany(mappedBy = "route", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<StopOver> stopOvers;

    public Integer getPlaceCount() {
        return this.routePlaces.size();
    }
}
