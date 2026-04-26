package _team.onmyway.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;

import java.time.LocalTime;

@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WorkingTime {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "place_id", nullable = false)
    private Place place;

    private Integer dayOfWeek;

    private LocalTime openTime;
    private LocalTime closeTime;

    private LocalTime breakStartTime;
    private LocalTime breakEndTime;

    private boolean isClosed; // 정기 휴무 여부

    private String description;
}
