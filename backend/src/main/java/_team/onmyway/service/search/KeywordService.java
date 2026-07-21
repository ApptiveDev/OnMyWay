package _team.onmyway.service.search;

import _team.onmyway.repository.hashtag.HashtagRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class KeywordService {
    private final HashtagRepository hashtagRepository;

    public List<String> popularHashtags() {
        List<String> hashtags = hashtagRepository.findTop10Tags(PageRequest.of(0, 10));
        return hashtags;
    }
}
