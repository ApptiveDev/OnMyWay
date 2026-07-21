package _team.onmyway.entity.hashtag;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;


@Entity
@Table(
        name = "hashTags",
        indexes = {
                @Index(name = "idx_hashtags_total_count", columnList = "totalCount DESC")
        }
)
public class HashTags {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @NotBlank
    private String tag;

    private Long totalCount = 0L;

    public String getTag() {
        return tag;
    }

    public void setTotalCount(Long totalCount) {
        this.totalCount = totalCount;
    }
}
