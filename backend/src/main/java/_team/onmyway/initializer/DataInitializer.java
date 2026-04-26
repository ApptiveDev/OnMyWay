package _team.onmyway.initializer;

import _team.onmyway.entity.Place;
import _team.onmyway.entity.ServiceCategory;
import _team.onmyway.entity.WorkingTime;
import _team.onmyway.repository.PlaceRepository;
import _team.onmyway.repository.ServiceCategoryRepository;
import _team.onmyway.repository.WorkingTimeRepository;
import com.opencsv.CSVReader;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.Resource;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
import org.springframework.core.io.support.ResourcePatternResolver;
import org.springframework.stereotype.Component;

import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final PlaceRepository placeRepository;
    private final ServiceCategoryRepository serviceCategoryRepository;
    private final WorkingTimeRepository workingTimeRepository;

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
        processOneMeal();
        processOneSnack();
        processOneView();
    }

    private void processOneRest() throws Exception{
        processSection("classpath:data/one_rest/*.csv", 3);
    }

    private void processOneCup() throws Exception {
        processSection("classpath:data/one_cup/*.csv", 1);
    }

    private void processOneGame() throws Exception {
        processSection("classpath:data/one_game/*.csv", 4);
    }

    private void processOneMeal() throws Exception {
        processSection("classpath:data/one_meal/*.csv", 6);
    }

    private void processOneSnack() throws Exception {
        processSection("classpath:data/one_snack/*.csv",2);
    }

    private void processOneView() throws Exception {
        processSection("classpath:data/one_view/*.csv", 5);
    }

    private void processSection(String location, Integer category) throws Exception {
        Resource[] resources = resolver.getResources(location);
        ServiceCategory serviceCategory = serviceCategoryRepository.findById(category);

        Resource basicResource = resources[1];
        basicPlace(basicResource, serviceCategory);

        Resource openCloseResource = resources[0];
        openClose(openCloseResource);
    }

    private void basicPlace(Resource resource, ServiceCategory serviceCategory) throws Exception {
        // 기본 정보 : 이름, 주소, 위도, 경도 우선 읽기
        try (CSVReader csvReader = new CSVReader((
                new InputStreamReader(resource.getInputStream(), StandardCharsets.UTF_8)))) {
            String[] rawHeaders = csvReader.readNext(); // Header(열) 읽기
            if (rawHeaders == null) return;

            // csv의 Header를 Header 이름 - index 형태로 매핑
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

            // csv 파일 끝까지, 한 줄 씩 읽기
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
            placeRepository.saveAll(restEntities);
        }
    }

    private void openClose(Resource resource) throws Exception {
        // 저장한 기본정보를 기반으로 영업시간 읽기(요일, 여는시간, 닫는시간, 브레이크 시작, 브레이크 끝, 라스트오더, 휴무여부, 비고)
        try (CSVReader csvReader = new CSVReader((
                new InputStreamReader(resource.getInputStream(), StandardCharsets.UTF_8)))) {

            String[] rawHeaders = csvReader.readNext(); // Header(열) 읽기
            if (rawHeaders == null) return;

            // csv의 Header를 Header 이름 - index 형태로 매핑
            Map<String, Integer> columnMap = new HashMap<>();

            for (int i = 0; i < rawHeaders.length; i++) {
                if (rawHeaders[i].startsWith("\uFEFF")) rawHeaders[i] = rawHeaders[i].substring(1);
                if (headerMap.containsKey(rawHeaders[i].trim())) { // 공백 등 제거
                    rawHeaders[i] = headerMap.get(rawHeaders[i]);
                }
                columnMap.put(rawHeaders[i], i);
            }

            List<WorkingTime> openCloseEntries = new ArrayList<>();
            String[] line;

            // 모든 place를 읽어 list 형태로 저장(데이터 초기 저장 시간을 줄이기 위함)
            List<Place> allPlaces = placeRepository.findAll();
            // "이름_주소"를 key로 하여 가게 정보를 가지고 옴
            Map<String, Place> placeMap = allPlaces.stream()
                    .collect(
                            Collectors.toMap(
                                    p -> p.getAddress()+"_"+p.getName(),
                                    p->p,
                                    (existing, replacement) -> existing
                            )
                    );

            // hh:mm 형태의 시간 데이터를 가져와 LocalTime으로 반환 가능하게 함.
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("H:mm");

            while((line = csvReader.readNext()) != null) {
                String name = getValue(line, columnMap, "이름");
                String address = getValue(line, columnMap, "주소");
                Integer dayweek = Integer.parseInt(getValue(line, columnMap, "요일"));

                LocalTime open = null;
                if (getValue(line, columnMap, "여는시간").length() > 0) {
                    open = LocalTime.parse(getValue(line, columnMap, "여는시간"), formatter);
                }

                LocalTime close = null;
                if (getValue(line, columnMap, "닫는시간").length() > 0) {
                    close = LocalTime.parse(getValue(line, columnMap, "닫는시간"), formatter);
                }

                Boolean isClose = false;
                if (getValue(line, columnMap, "휴무여부").length() > 0) {
                    isClose = Boolean.TRUE;
                }

                String description = null;
                if (getValue(line, columnMap, "비고").length() > 0) {
                    description = getValue(line, columnMap, "비고");
                }

                log.info(address+" "+name);
                Place findPlace = placeMap.get(address+"_"+name);
                log.info(findPlace.getName()+" "+findPlace.getAddress());

                WorkingTime workingTime = WorkingTime.builder()
                        .dayOfWeek(dayweek)
                        .place(findPlace)
                        .openTime(open)
                        .closeTime(close)
                        .isClosed(isClose)
                        .description(description)
                        .build();

                openCloseEntries.add(workingTime);
            }
            workingTimeRepository.saveAll(openCloseEntries);
        }
    }

    private String getValue(String[] line, Map<String, Integer> columnMap, String key) {
        // header의 위치를 index로 찾아, 행에서 해당 index의 값을 가지고 온다.
        Integer index = columnMap.get(key);
        return (index != null & index < line.length) ? line[index] : null;
    }

}
