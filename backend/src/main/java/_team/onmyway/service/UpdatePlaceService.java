package _team.onmyway.service;

import _team.onmyway.dto.request.UpdatePlaceDTO;
import _team.onmyway.entity.Place;
import _team.onmyway.entity.UpdateRequest;
import _team.onmyway.entity.Users;
import _team.onmyway.repository.PlaceRepository;
import _team.onmyway.repository.UpdateRequestRepository;
import _team.onmyway.repository.UsersRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UpdatePlaceService {
    private final UpdateRequestRepository updateRequestRepository;
    private final PlaceRepository placeRepository;
    private final UsersRepository usersRepository;

    public String updateRequest(UpdatePlaceDTO updatePlaceDTO, Long placeId, Long userId) {
        Place place = placeRepository.findById(placeId).orElse(null);
        Users user = usersRepository.findById(userId).orElse(null);

        UpdateRequest updateRequest = UpdateRequest.builder()
                .place(place)
                .updatePlace(updatePlaceDTO)
                .user(user)
                .build();

        updateRequestRepository.save(updateRequest);
        return "성공";
    }
}
