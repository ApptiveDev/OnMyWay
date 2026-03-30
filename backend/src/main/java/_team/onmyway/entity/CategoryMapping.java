package _team.onmyway.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor
public class CategoryMapping {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    private SourceType source;

    private String apiCategory;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "service_category_id")
    private ServiceCategory serviceCategory;
}