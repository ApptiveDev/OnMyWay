package _team.onmyway.repository;

import _team.onmyway.entity.Route;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RouteRepository extends JpaRepository<Route, Integer> {
    @Query("select r from Route r join fetch Users u where u.id =:id")
    public List<Route> findByUsersId(Long id);
    public Route findById(Long id);
}
