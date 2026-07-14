package _team.onmyway.entity;

import jakarta.persistence.*;
import org.apache.catalina.User;

@Entity
public class Follow {
    @Id
    @GeneratedValue
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn
    private Users fromUser;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn
    private Users toUser;
}
