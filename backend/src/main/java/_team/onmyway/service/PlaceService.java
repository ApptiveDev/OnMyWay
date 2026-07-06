package _team.onmyway.service;

import _team.onmyway.dto.PlaceDetailDTO;
import _team.onmyway.repository.HashtagMappingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PlaceService {

    private final HashtagMappingRepository hashtagMappingRepository;

    public PlaceDetailDTO getHashtags(Long placeId) {
        List<String> hashtagMappings = hashtagMappingRepository.findHashtagByPlaceId(placeId);

        PlaceDetailDTO placeDetail = new PlaceDetailDTO(placeId, hashtagMappings);
        return placeDetail;
    }
}
