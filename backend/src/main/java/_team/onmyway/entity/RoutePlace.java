package _team.onmyway.entity;

import jakarta.persistence.*;
import lombok.Getter;
import org.springframework.jmx.export.annotation.ManagedAttribute;

import javax.annotation.processing.Generated;

@Entity
@Getter
public class RoutePlace {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private Route route;

    @ManyToOne
    private Place place;

    private int time;

    public void updateTime(int time) {
        this.time = time;
    }
}
