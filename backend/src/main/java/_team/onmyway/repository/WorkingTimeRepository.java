package _team.onmyway.repository;

import _team.onmyway.entity.Place;
import _team.onmyway.entity.WorkingTime;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface WorkingTimeRepository extends JpaRepository<WorkingTime, Integer> {
    public List<WorkingTime> findByPlace(Place place);
}
