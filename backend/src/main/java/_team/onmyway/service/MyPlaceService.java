package _team.onmyway.service;

import _team.onmyway.dto.LikePlaceDTO;
import _team.onmyway.dto.PlaceRecommendationDTO;
import _team.onmyway.dto.PositionDTO;
import _team.onmyway.dto.RecommendationResponseDTO;
import _team.onmyway.entity.HashTags;
import _team.onmyway.entity.LikePlace;
import _team.onmyway.entity.Place;
import _team.onmyway.entity.Users;
import _team.onmyway.exception.NoPlacesException;
import _team.onmyway.exception.UserNotFoundException;
import _team.onmyway.repository.HashtagMappingRepository;
import _team.onmyway.repository.LikePlaceRepository;
import _team.onmyway.repository.PlaceRepository;
import _team.onmyway.repository.UsersRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;

import java.awt.*;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class MyPlaceService {
    private final LikePlaceRepository likePlaceRepository;
    private final HashtagMappingRepository hashtagMappingRepository;
    private final PlaceRepository placeRepository;
    private final UsersRepository usersRepository;

    private final GeoDistanceService geoDistanceService;
    private final ImageService imageService;

    public Mono<List<PlaceRecommendationDTO>> getLikePlaces(Long userId, Double lat, Double lon) {
        return Mono.fromCallable(() -> likePlaceRepository.findPlaceByUsersId(userId))
                .subscribeOn(Schedulers.boundedElastic()) // 다른 스레드를 만들어 거기서 데이터를 가지고 옴.
                .flatMap(likePlaces -> toDTO(likePlaces, lat, lon));
    }

    private Mono<List<PlaceRecommendationDTO>> toDTO(List<Place> likePlaces,
                                               Double lat, Double lon) {
        int weekday = LocalDate.now().getDayOfWeek().getValue()%7;

        return Flux.fromIterable(likePlaces)
                .flatMap(place -> {
                    String category = place.getServiceCategory().getName();
                    double estimateDis = geoDistanceService.distanceMeters(
                            place.getLat(), place.getLng(), lat, lon
                    );
                    int estimateTime = geoDistanceService.estimateWalkingMinutes(estimateDis);

                    LocalTime open = place.getWorkingTimes().get(weekday).getOpenTime();
                    LocalTime close = place.getWorkingTimes().get(weekday).getCloseTime();
                    boolean isClosed = place.getWorkingTimes().get(weekday).isClosed();

                    return imageService.getImageURL(place)
                            .map(imgURL -> new PlaceRecommendationDTO(
                                    place.getId(),
                                    place.getName(),
                                    place.getLat(),
                                    place.getLng(),
                                    category,
                                    estimateTime,
                                    open,
                                    close,
                                    place.getCatchPhrase(),
                                    isClosed,
                                    imgURL,
                                    true
                            ));
                })
                .collectList();
    }

    public List<String> getPlaceHashtags(Long placeId) {
        List<String> hashtags = hashtagMappingRepository.findHashtagByPlaceId(placeId);
        return hashtags;
    }

    public LikePlaceDTO likePlace(long userId, long placeId) {
        Users user = usersRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("존재하지 않는 회원입니다."));
        Place place = placeRepository.findById(placeId);

        LikePlace likeplace = LikePlace.builder()
                .place(place)
                .user(user)
                .build();

        likePlaceRepository.save(likeplace);
        return new LikePlaceDTO(placeId, true);
    }
}
