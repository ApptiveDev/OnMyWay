package _team.onmyway.repository;

import _team.onmyway.entity.category.ServiceCategory;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ServiceCategoryRepository extends JpaRepository<ServiceCategory, Long> {
    public ServiceCategory findById(long id);
}
