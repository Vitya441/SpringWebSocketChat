package org.example.socketwebchat.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration // sourse of beans
@EnableWebSocketMessageBroker // enable websocket
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {
    // registry the end-point that client will use to connect to out WebSocket Server
    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws").withSockJS();
    }

    // configure message-broker which will be used to route(направления) from
    // one client to another
    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        // if message-address starts with /app -> route to the brocker-message
        registry.setApplicationDestinationPrefixes("/app"); //destination of project
        registry.enableSimpleBroker("/topic");
    }

}
