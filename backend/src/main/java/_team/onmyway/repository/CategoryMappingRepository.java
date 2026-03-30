package _team.onmyway.repository;

import _team.onmyway.entity.CategoryMapping;
import _team.onmyway.entity.SourceType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CategoryMappingRepository extends JpaRepository<CategoryMapping, Long> {

    Optional<CategoryMapping> findBySourceAndApiCategory(SourceType source, String apiCategory);
}