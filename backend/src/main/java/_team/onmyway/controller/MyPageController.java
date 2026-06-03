package _team.onmyway.controller;

import _team.onmyway.dto.MyPageDTO;
import _team.onmyway.service.MyPageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class MyPageController {

    private final MyPageService myPageService;

    @GetMapping("myPage")
    public ResponseEntity<?> myPageHome() {
        MyPageDTO mypage = myPageService.Home();
        return new ResponseEntity<>(mypage, HttpStatus.OK);
    }
}
