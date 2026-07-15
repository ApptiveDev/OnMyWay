package _team.onmyway.converter;

import _team.onmyway.dto.request.UpdatePlaceDTO;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import org.springframework.security.core.parameters.P;

@Converter
public class UpdatePlaceDTOConverter implements AttributeConverter<UpdatePlaceDTO, String> {
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public String convertToDatabaseColumn(UpdatePlaceDTO updatePlaceDTO) {
        if (updatePlaceDTO == null) {
            return null;
        }

        try {
            return objectMapper.writeValueAsString(updatePlaceDTO);
        } catch(JsonProcessingException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public UpdatePlaceDTO convertToEntityAttribute(String jsonString) {
        if (jsonString == null || jsonString.isEmpty()) {
            return null;
        }

        try {
            return objectMapper.readValue(jsonString, UpdatePlaceDTO.class);
        } catch(JsonProcessingException e) {
            throw new RuntimeException(e);
        }
    }
}
