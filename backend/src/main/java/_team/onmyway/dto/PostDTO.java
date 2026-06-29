package _team.onmyway.dto;

import _team.onmyway.entity.PostPhotos;
import _team.onmyway.entity.Posts;

import java.util.List;
import java.util.stream.Collectors;

public record PostDTO(
        String title,
        String author,
        String content,
        List<String> imageURLs
) {
    public static PostDTO fromPost(Posts post) {
        PostDTO postDTO = new PostDTO(
                post.getTitle(),
                post.getAuthor().getNickname(),
                post.getContent(),
                post.getPhotos().stream()
                        .map(PostPhotos::getPhoto)
                        .collect(Collectors.toList())
        );
        return postDTO;
    }
}
