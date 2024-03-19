package org.example.socketwebchat.chat;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Controller;

@Controller
public class ChatController {
    // @Payload - обрабатывает входящее сообщение, извлекает из него тело,
    // и преобразует его в Java объект, который далее передается в метод контроллера
    @MessageMapping("/chat.sendMessage") // url address
    @SendTo("/topic/public") // where message will be sent
    public ChatMessage sendMessage(@Payload ChatMessage chatMessage) { // usefull load (полезная нагрузка)
        return chatMessage;
    }

    @MessageMapping("/chat.addUser")
    @SendTo("/topic/public")
    public ChatMessage addUser(
            @Payload ChatMessage chatMessage,
            SimpMessageHeaderAccessor headerAccessor // для доступа к атрибутам сообщения
    ) {
        // Add username in websocket session
        headerAccessor.getSessionAttributes().put("username", chatMessage.getSender());
        return chatMessage;
    }
}
