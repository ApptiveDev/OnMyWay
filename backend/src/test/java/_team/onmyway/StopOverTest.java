package _team.onmyway;

import _team.onmyway.dto.PositionDTO;
import _team.onmyway.service.RouteService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

public class StopOverTest {
    private final RouteService routeService = new RouteService(new ObjectMapper());

    @DisplayName("경우 1 - 부산대 출발, 부산대역 도착")
    @Test
    public void stopOver1() {
        PositionDTO start = new PositionDTO(35.23156359900799,129.08419609265866); // 부산대 정문
        PositionDTO end = new PositionDTO(35.22939549317848,129.0892090952714); // 부산대역

        PositionDTO stopover = ReflectionTestUtils.invokeMethod(routeService, "makeStopOver", start, end);
        System.out.println(stopover.getLat()+" "+stopover.getLon());
    }

    @DisplayName("경우 2 - 부산대역 출발, 부산대 도착")
    @Test
    public void stopOver2() {
        PositionDTO start = new PositionDTO(35.22939549317848,129.0892090952714); // 부산대역
        PositionDTO end = new PositionDTO(35.23156359900799,129.08419609265866); // 부산대 정문

        PositionDTO stopover = ReflectionTestUtils.invokeMethod(routeService, "makeStopOver", start, end);
        System.out.println(stopover.getLat()+" "+stopover.getLon());
    }

    @DisplayName("경우 3 - 금정초 출발, 우신뉴타운 도착")
    @Test
    public void stopOver3() {
        PositionDTO start = new PositionDTO(35.22771962605747,129.0842295352885); // 금정초
        PositionDTO end = new PositionDTO(35.23402614284916,129.09058544817464); // 우신뉴타운

        PositionDTO stopover = ReflectionTestUtils.invokeMethod(routeService, "makeStopOver", start, end);
        System.out.println(stopover.getLat()+" "+stopover.getLon());
    }

    @DisplayName("경우 4 - 우신뉴타운 출발, 금정초 도착")
    @Test
    public void stopOver4() {
        PositionDTO start = new PositionDTO(35.23402614284916,129.09058544817464); // 우신뉴타운
        PositionDTO end = new PositionDTO(35.22771962605747,129.0842295352885); // 금정초

        PositionDTO stopover = ReflectionTestUtils.invokeMethod(routeService, "makeStopOver", start, end);
        System.out.println(stopover.getLat()+" "+stopover.getLon());
    }
}
