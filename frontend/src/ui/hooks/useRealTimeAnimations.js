import { useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';
import WebSocketService from '../services/WebSocketService.js';

export const useRealTimeAnimations = () => {
  const animationQueue = useRef([]);
  const isProcessing = useRef(false);

  const processAnimationQueue = useCallback(() => {
    if (isProcessing.current || animationQueue.current.length === 0) return;
    
    isProcessing.current = true;
    const animation = animationQueue.current.shift();
    
    executeAnimation(animation).finally(() => {
      isProcessing.current = false;
      if (animationQueue.current.length > 0) {
        setTimeout(processAnimationQueue, 50);
      }
    });
  }, []);

  const executeAnimation = useCallback(async (event) => {
    const { type, target, data } = event;
    const elements = document.querySelectorAll(target);
    
    if (!elements.length) return;

    switch (type) {
      case 'pulse':
        return gsap.to(elements, {
          scale: 1.1,
          duration: 0.3,
          yoyo: true,
          repeat: 1,
          ease: "power2.inOut"
        });
      
      case 'shake':
        return gsap.to(elements, {
          x: [-5, 5, -5, 5, 0],
          duration: 0.5,
          ease: "power2.inOut"
        });
      
      case 'glow':
        return gsap.to(elements, {
          boxShadow: "0 0 20px rgba(255, 255, 255, 0.8)",
          duration: 0.5,
          yoyo: true,
          repeat: 1
        });
      
      case 'slideIn':
        return gsap.fromTo(elements, 
          { x: data.from || -100, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.6, ease: "power2.out" }
        );
      
      case 'fadeIn':
        return gsap.fromTo(elements,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
        );
      
      case 'bounce':
        return gsap.to(elements, {
          y: -20,
          duration: 0.3,
          yoyo: true,
          repeat: 3,
          ease: "bounce.out"
        });
      
      default:
        console.warn('Unknown animation type:', type);
    }
  }, []);

  const triggerAnimation = useCallback((type, target, data = {}) => {
    const event = { type, target, data, timestamp: Date.now() };
    animationQueue.current.push(event);
    processAnimationQueue();
    
    // Also send to other users via WebSocket
    WebSocketService.triggerAnimation(type, target, data);
  }, [processAnimationQueue]);

  useEffect(() => {
    const connectAndSubscribe = async () => {
      try {
        await WebSocketService.connect();
        
        WebSocketService.subscribeToAnimations((event) => {
          animationQueue.current.push(event);
          processAnimationQueue();
        });
        
      } catch (error) {
        console.error('Failed to connect to WebSocket:', error);
      }
    };

    connectAndSubscribe();

    return () => {
      WebSocketService.disconnect();
    };
  }, [processAnimationQueue]);

  return { triggerAnimation };
};