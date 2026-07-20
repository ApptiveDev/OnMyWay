package _team.onmyway.controller.apis;

import _team.onmyway.service.KeywordService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController("/api/keywords")
@RequiredArgsConstructor
public class KeywordController {
    private final KeywordService keywordService;

    public ResponseEntity<List<String>> getPopularKeywords() {
        List<String> hashs = keywordService.popularHashtags();
        return new ResponseEntity<>(hashs, HttpStatus.OK);
    }
}
