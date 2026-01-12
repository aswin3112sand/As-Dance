package com.asdance.realtime;

import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AnimationEvent {
    private String type;
    private String target;
    private Object data;
    private long timestamp;
    private String userId;
}

@Data
@AllArgsConstructor
@NoArgsConstructor
class UserActivityEvent {
    private String userId;
    private String action;
    private String page;
    private long timestamp;
}

@Data
@AllArgsConstructor
@NoArgsConstructor
class UserAnimationEvent {
    private String userId;
    private AnimationEvent animationEvent;
}