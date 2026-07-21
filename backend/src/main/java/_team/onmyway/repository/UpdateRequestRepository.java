package _team.onmyway.repository;

import _team.onmyway.entity.update.UpdateRequest;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UpdateRequestRepository extends JpaRepository<UpdateRequest, Integer> {
}
