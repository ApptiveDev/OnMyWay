package _team.onmyway.initializer;

import _team.onmyway.entity.Place;
import _team.onmyway.entity.ServiceCategory;
import _team.onmyway.repository.PlaceRepository;
import _team.onmyway.repository.ServiceCategoryRepository;
import com.opencsv.CSVReader;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.Resource;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
import org.springframework.core.io.support.ResourcePatternResolver;
import org.springframework.stereotype.Component;

import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.*;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final PlaceRepository placeRepository;
    private final ServiceCategoryRepository serviceCategoryRepository;

    private final Map<String, String> headerMap = Map.of(
            "시설명","이름", "콘텐츠명","이름", "공원명","이름",
            "소재지지번주소", "주소",
            "지번주소","주소"
    ); // csv 헤더 매핑 구조를 생성

    private final ResourcePatternResolver resolver =
            new PathMatchingResourcePatternResolver();

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        // if (placeRepository.count() > 0) return; 운영 시에만 켜두기
        processOneRest();
        processOneCup();
        processOneGame();
        processOneSnack();
        processOneMeal();
        processOneView();
    }

    private void processOneRest() throws Exception{
        Resource[] resources = resolver.getResources("classpath:data/one_rest/*.csv");
        ServiceCategory serviceCategory = serviceCategoryRepository.findById(3);

        for (Resource resource : resources) {
            try (CSVReader csvReader = new CSVReader((
                    new InputStreamReader(resource.getInputStream(), StandardCharsets.UTF_8)))) {

                String[] rawHeaders = csvReader.readNext(); // Header(열) 읽기
                if (rawHeaders == null) return;

                Map<String, Integer> columnMap = new HashMap<>();

                for (int i = 0; i < rawHeaders.length; i++) {
                    //System.out.println(rawHeaders[i]);

                    if (rawHeaders[i].startsWith("\uFEFF")) rawHeaders[i] = rawHeaders[i].substring(1);
                    if (headerMap.containsKey(rawHeaders[i].trim())) { // 공백 등 제거
                        rawHeaders[i] = headerMap.get(rawHeaders[i]);
                    }
                    columnMap.put(rawHeaders[i], i);
                }

                List<Place> restEntities = new ArrayList<>();
                String[] line;

                while((line = csvReader.readNext()) != null) {
                    Place place = Place.builder()
                            .name(getValue(line, columnMap, "이름"))
                            .address(getValue(line, columnMap, "주소"))
                            .lat(Double.parseDouble(getValue(line, columnMap, "위도")))
                            .lng(Double.parseDouble(getValue(line, columnMap, "경도")))
                            .serviceCategory(serviceCategory)
                            .createdAt(LocalDateTime.now())
                            .build();
                    restEntities.add(place);
                }

                System.out.println(restEntities.size());
                placeRepository.saveAll(restEntities);
            }
        }
    }

    private void processOneCup() throws Exception {
        Resource[] resources = resolver.getResources("classpath:data/one_cup/*.csv");
        ServiceCategory serviceCategory = serviceCategoryRepository.findById(1);

        for (Resource resource : resources) {
            System.out.println(resource.getFilename());
            try (CSVReader csvReader = new CSVReader((
                    new InputStreamReader(resource.getInputStream(), StandardCharsets.UTF_8)))) {

                String[] rawHeaders = csvReader.readNext(); // Header(열) 읽기
                if (rawHeaders == null) return;

                Map<String, Integer> columnMap = new HashMap<>();

                for (int i = 0; i < rawHeaders.length; i++) {
                    //System.out.println(rawHeaders[i]);

                    if (rawHeaders[i].startsWith("\uFEFF")) rawHeaders[i] = rawHeaders[i].substring(1);
                    if (headerMap.containsKey(rawHeaders[i].trim())) { // 공백 등 제거
                        rawHeaders[i] = headerMap.get(rawHeaders[i]);
                    }
                    columnMap.put(rawHeaders[i], i);
                }

                List<Place> restEntities = new ArrayList<>();
                String[] line;

                while ((line = csvReader.readNext()) != null) {
                    Place place = Place.builder()
                            .name(getValue(line, columnMap, "이름"))
                            .address(getValue(line, columnMap, "주소"))
                            .lat(Double.parseDouble(getValue(line, columnMap, "위도")))
                            .lng(Double.parseDouble(getValue(line, columnMap, "경도")))
                            .serviceCategory(serviceCategory)
                            .createdAt(LocalDateTime.now())
                            .build();
                    restEntities.add(place);
                }

                System.out.println(restEntities.size());
                placeRepository.saveAll(restEntities);
            }
        }
    }

    private void processOneGame() throws Exception {
        Resource[] resources = resolver.getResources("classpath:data/one_game/*.csv");
        ServiceCategory serviceCategory = serviceCategoryRepository.findById(4);

        for (Resource resource : resources) {
            System.out.println(resource.getFilename());
            try (CSVReader csvReader = new CSVReader((
                    new InputStreamReader(resource.getInputStream(), StandardCharsets.UTF_8)))) {

                String[] rawHeaders = csvReader.readNext(); // Header(열) 읽기
                if (rawHeaders == null) return;

                Map<String, Integer> columnMap = new HashMap<>();

                for (int i = 0; i < rawHeaders.length; i++) {
                    //System.out.println(rawHeaders[i]);

                    if (rawHeaders[i].startsWith("\uFEFF")) rawHeaders[i] = rawHeaders[i].substring(1);
                    if (headerMap.containsKey(rawHeaders[i].trim())) { // 공백 등 제거
                        rawHeaders[i] = headerMap.get(rawHeaders[i]);
                    }
                    columnMap.put(rawHeaders[i], i);
                }

                List<Place> restEntities = new ArrayList<>();
                String[] line;

                while ((line = csvReader.readNext()) != null) {
                    Place place = Place.builder()
                            .name(getValue(line, columnMap, "이름"))
                            .address(getValue(line, columnMap, "주소"))
                            .lat(Double.parseDouble(getValue(line, columnMap, "위도")))
                            .lng(Double.parseDouble(getValue(line, columnMap, "경도")))
                            .serviceCategory(serviceCategory)
                            .createdAt(LocalDateTime.now())
                            .build();
                    restEntities.add(place);
                }

                System.out.println(restEntities.size());
                placeRepository.saveAll(restEntities);
            }
        }
    }

    private void processOneMeal() throws Exception {
        Resource[] resources = resolver.getResources("classpath:data/one_meal/*.csv");
        ServiceCategory serviceCategory = serviceCategoryRepository.findById(6);

        for (Resource resource : resources) {
            System.out.println(resource.getFilename());
            try (CSVReader csvReader = new CSVReader((
                    new InputStreamReader(resource.getInputStream(), StandardCharsets.UTF_8)))) {

                String[] rawHeaders = csvReader.readNext(); // Header(열) 읽기
                if (rawHeaders == null) return;

                Map<String, Integer> columnMap = new HashMap<>();

                for (int i = 0; i < rawHeaders.length; i++) {
                    //System.out.println(rawHeaders[i]);

                    if (rawHeaders[i].startsWith("\uFEFF")) rawHeaders[i] = rawHeaders[i].substring(1);
                    if (headerMap.containsKey(rawHeaders[i].trim())) { // 공백 등 제거
                        rawHeaders[i] = headerMap.get(rawHeaders[i]);
                    }
                    columnMap.put(rawHeaders[i], i);
                }

                List<Place> restEntities = new ArrayList<>();
                String[] line;

                while ((line = csvReader.readNext()) != null) {
                    Place place = Place.builder()
                            .name(getValue(line, columnMap, "이름"))
                            .address(getValue(line, columnMap, "주소"))
                            .lat(Double.parseDouble(getValue(line, columnMap, "위도")))
                            .lng(Double.parseDouble(getValue(line, columnMap, "경도")))
                            .serviceCategory(serviceCategory)
                            .createdAt(LocalDateTime.now())
                            .build();
                    restEntities.add(place);
                }

                System.out.println(restEntities.size());
                placeRepository.saveAll(restEntities);
            }
        }
    }

    private void processOneSnack() throws Exception {
        Resource[] resources = resolver.getResources("classpath:data/one_snack/*.csv");
        ServiceCategory serviceCategory = serviceCategoryRepository.findById(2);

        for (Resource resource : resources) {
            try (CSVReader csvReader = new CSVReader((
                    new InputStreamReader(resource.getInputStream(), StandardCharsets.UTF_8)))) {

                String[] rawHeaders = csvReader.readNext(); // Header(열) 읽기
                if (rawHeaders == null) return;

                Map<String, Integer> columnMap = new HashMap<>();

                for (int i = 0; i < rawHeaders.length; i++) {
                    if (rawHeaders[i].startsWith("\uFEFF")) rawHeaders[i] = rawHeaders[i].substring(1);
                    if (headerMap.containsKey(rawHeaders[i].trim())) { // 공백 등 제거
                        rawHeaders[i] = headerMap.get(rawHeaders[i]);
                    }
                    columnMap.put(rawHeaders[i], i);
                }

                List<Place> restEntities = new ArrayList<>();
                String[] line;

                while ((line = csvReader.readNext()) != null) {
                    Place place = Place.builder()
                            .name(getValue(line, columnMap, "이름"))
                            .address(getValue(line, columnMap, "주소"))
                            .lat(Double.parseDouble(getValue(line, columnMap, "위도")))
                            .lng(Double.parseDouble(getValue(line, columnMap, "경도")))
                            .serviceCategory(serviceCategory)
                            .createdAt(LocalDateTime.now())
                            .build();
                    restEntities.add(place);
                }

                System.out.println(restEntities.size());
                placeRepository.saveAll(restEntities);
            }
        }
    }

    private void processOneView() throws Exception {
        Resource[] resources = resolver.getResources("classpath:data/one_view/*.csv");
        ServiceCategory serviceCategory = serviceCategoryRepository.findById(5);

        for (Resource resource : resources) {
            System.out.println(resource.getFilename());
            try (CSVReader csvReader = new CSVReader((
                    new InputStreamReader(resource.getInputStream(), StandardCharsets.UTF_8)))) {

                String[] rawHeaders = csvReader.readNext(); // Header(열) 읽기
                if (rawHeaders == null) return;

                Map<String, Integer> columnMap = new HashMap<>();

                for (int i = 0; i < rawHeaders.length; i++) {
                    //System.out.println(rawHeaders[i]);

                    if (rawHeaders[i].startsWith("\uFEFF")) rawHeaders[i] = rawHeaders[i].substring(1);
                    if (headerMap.containsKey(rawHeaders[i].trim())) { // 공백 등 제거
                        rawHeaders[i] = headerMap.get(rawHeaders[i]);
                    }
                    columnMap.put(rawHeaders[i], i);
                }

                List<Place> restEntities = new ArrayList<>();
                String[] line;

                while ((line = csvReader.readNext()) != null) {
                    Place place = Place.builder()
                            .name(getValue(line, columnMap, "이름"))
                            .address(getValue(line, columnMap, "주소"))
                            .lat(Double.parseDouble(getValue(line, columnMap, "위도")))
                            .lng(Double.parseDouble(getValue(line, columnMap, "경도")))
                            .serviceCategory(serviceCategory)
                            .createdAt(LocalDateTime.now())
                            .build();
                    restEntities.add(place);
                }

                System.out.println(restEntities.size());
                placeRepository.saveAll(restEntities);
            }
        }
    }



    private String getValue(String[] line, Map<String, Integer> columnMap, String key) {
        Integer index = columnMap.get(key);
        return (index != null & index < line.length) ? line[index] : null;
    }

}
