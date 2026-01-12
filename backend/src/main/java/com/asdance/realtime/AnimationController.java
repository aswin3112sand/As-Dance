package com.asdance.realtime;

import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@Controller
@RequiredArgsConstructor
public class AnimationController {

    private final SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/animation/trigger")
    @SendTo("/topic/animations")
    public AnimationEvent handleAnimationTrigger(AnimationEvent event) {
        return event;
    }

    @MessageMapping("/user/status")
    @SendTo("/topic/user-activity")
    public UserActivityEvent handleUserActivity(UserActivityEvent event) {
        return event;
    }
}

@RestController
@RequiredArgsConstructor
class AnimationRestController {

    private final SimpMessagingTemplate messagingTemplate;

    @PostMapping("/api/animations/broadcast")
    public void broadcastAnimation(@RequestBody AnimationEvent event) {
        messagingTemplate.convertAndSend("/topic/animations", event);
    }

    @PostMapping("/api/animations/user")
    public void sendToUser(@RequestBody UserAnimationEvent event) {
        messagingTemplate.convertAndSendToUser(
            event.getUserId(), 
            "/queue/animations", 
            event.getAnimationEvent()
        );
    }
}