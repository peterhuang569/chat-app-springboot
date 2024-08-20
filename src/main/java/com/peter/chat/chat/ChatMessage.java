package com.peter.chat.chat;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "messages")
public class ChatMessage {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private String content;


    private String sender;

    private LocalDateTime timestamp;

    @Enumerated(EnumType.STRING)
    private MessageType messageType;
}
