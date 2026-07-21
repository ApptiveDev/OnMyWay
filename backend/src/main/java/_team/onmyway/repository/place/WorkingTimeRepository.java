package _team.onmyway.repository.place;

import _team.onmyway.entity.place.Place;
import _team.onmyway.entity.place.WorkingTime;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface WorkingTimeRepository extends JpaRepository<WorkingTime, Integer> {
    public List<WorkingTime> findByPlace(Place place);
}
