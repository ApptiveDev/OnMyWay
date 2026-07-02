package _team.onmyway.service;

import _team.onmyway.dto.PlaceDetailDTO;
import _team.onmyway.dto.UpdatePlaceDetailDTO;
import _team.onmyway.entity.HashtagMapping;
import _team.onmyway.repository.HashtagMappingRepository;
import _team.onmyway.repository.PlaceRepository;
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
