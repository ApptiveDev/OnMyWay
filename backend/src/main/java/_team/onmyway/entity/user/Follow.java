package _team.onmyway.entity.user;

import jakarta.persistence.*;

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
