package _team.onmyway.repository;

import _team.onmyway.entity.WorkingTime;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WorkingTimeRepository extends JpaRepository<WorkingTime, Integer> {
}
