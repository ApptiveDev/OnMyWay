package _team.onmyway.entity.update;

import _team.onmyway.converter.UpdatePlaceDTOConverter;
import _team.onmyway.dto.request.UpdatePlaceDTO;
import _team.onmyway.entity.place.Place;
import _team.onmyway.entity.user.Users;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne
    @JoinColumn(name = "users_id")
    private Users user;

    @ManyToOne
    @JoinColumn(name = "place_id")
    private Place place;

    @Convert(converter = UpdatePlaceDTOConverter.class)
    @Column(columnDefinition = "TEXT") // Text로 지정
    private UpdatePlaceDTO updatePlace;

    private RequestStatus status = RequestStatus.PENDING;
}
