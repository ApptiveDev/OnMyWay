package _team.onmyway.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.BatchSize;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(indexes = {
                @Index(name = "idx_lat_lng", columnList = "lat, lng"),
                @Index(name = "idx_service_category", columnList = "service_category_id")
        })
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Place {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 장소명
    private String name;

    private Double lat;
    private Double lng;

    private String address;

    // 카카오/네이버 원본 카테고리
    private String apiCategory;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "service_category_id")
    private ServiceCategory serviceCategory;

    // kakao place id / naver place id
    private String apiPlaceId;

    @Enumerated(EnumType.STRING)
    private SourceType source;

    private String sourceId;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    @BatchSize(size = 100)
    @OneToMany(mappedBy = "place") // 양방향 연결
    private List<WorkingTime> workingTimes = new ArrayList<>();

    @BatchSize(size = 100)
    @OneToMany(mappedBy = "place")
    private List<Photos> photos = new ArrayList<>();
}