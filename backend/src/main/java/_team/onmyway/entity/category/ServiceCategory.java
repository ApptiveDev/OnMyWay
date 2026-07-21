package _team.onmyway.entity.category;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor
public class ServiceCategory {

    @Id
    private Long id;

    private String name;
}
