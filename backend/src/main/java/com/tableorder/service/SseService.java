package com.tableorder.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.concurrent.ConcurrentHashMap;

@Service
@EnableScheduling
public class SseService {

    private static final Logger log = LoggerFactory.getLogger(SseService.class);
    private static final long SSE_TIMEOUT = 30 * 60 * 1000L; // 30 minutes
    private final ConcurrentHashMap<String, SseEmitter> emitters = new ConcurrentHashMap<>();

    public SseEmitter subscribe(String clientId) {
        SseEmitter emitter = new SseEmitter(SSE_TIMEOUT);
        emitters.put(clientId, emitter);

        emitter.onCompletion(() -> emitters.remove(clientId));
        emitter.onTimeout(() -> emitters.remove(clientId));
        emitter.onError(e -> emitters.remove(clientId));

        try {
            emitter.send(SseEmitter.event().name("connected").data("SSE connected").reconnectTime(3000));
        } catch (IOException e) {
            emitters.remove(clientId);
        }
        return emitter;
    }

    public void broadcast(String eventName, Object data) {
        emitters.forEach((id, emitter) -> {
            try {
                emitter.send(SseEmitter.event().name(eventName).data(data));
            } catch (IOException e) {
                emitters.remove(id);
                log.debug("Removed failed SSE emitter: {}", id);
            }
        });
    }

    @Scheduled(fixedRate = 30000)
    public void sendHeartbeat() {
        emitters.forEach((id, emitter) -> {
            try {
                emitter.send(SseEmitter.event().name("heartbeat").data("ping"));
            } catch (IOException e) {
                emitters.remove(id);
            }
        });
    }
}
