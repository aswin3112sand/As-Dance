import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

class WebSocketService {
  constructor() {
    this.client = null;
    this.connected = false;
    this.subscriptions = new Map();
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
  }

  connect() {
    if (this.connected) return Promise.resolve();

    return new Promise((resolve, reject) => {
      const socket = new SockJS('/ws');
      this.client = new Client({
        webSocketFactory: () => socket,
        debug: (str) => console.log('STOMP: ' + str),
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
      });

      this.client.onConnect = () => {
        this.connected = true;
        this.reconnectAttempts = 0;
        console.log('WebSocket connected');
        resolve();
      };

      this.client.onDisconnect = () => {
        this.connected = false;
        console.log('WebSocket disconnected');
      };

      this.client.onStompError = (frame) => {
        console.error('STOMP error:', frame);
        reject(new Error('WebSocket connection failed'));
      };

      this.client.activate();
    });
  }

  disconnect() {
    if (this.client) {
      this.client.deactivate();
      this.connected = false;
      this.subscriptions.clear();
    }
  }

  subscribe(destination, callback) {
    if (!this.connected) {
      console.warn('WebSocket not connected');
      return null;
    }

    const subscription = this.client.subscribe(destination, (message) => {
      try {
        const data = JSON.parse(message.body);
        callback(data);
      } catch (error) {
        console.error('Error parsing message:', error);
      }
    });

    this.subscriptions.set(destination, subscription);
    return subscription;
  }

  unsubscribe(destination) {
    const subscription = this.subscriptions.get(destination);
    if (subscription) {
      subscription.unsubscribe();
      this.subscriptions.delete(destination);
    }
  }

  send(destination, data) {
    if (!this.connected) {
      console.warn('WebSocket not connected');
      return;
    }

    this.client.publish({
      destination,
      body: JSON.stringify(data)
    });
  }

  // Animation specific methods
  triggerAnimation(animationType, target, data = {}) {
    const event = {
      type: animationType,
      target,
      data,
      timestamp: Date.now(),
      userId: this.getCurrentUserId()
    };

    this.send('/app/animation/trigger', event);
  }

  subscribeToAnimations(callback) {
    return this.subscribe('/topic/animations', callback);
  }

  subscribeToUserActivity(callback) {
    return this.subscribe('/topic/user-activity', callback);
  }

  sendUserActivity(action, page) {
    const event = {
      userId: this.getCurrentUserId(),
      action,
      page,
      timestamp: Date.now()
    };

    this.send('/app/user/status', event);
  }

  getCurrentUserId() {
    // Get from auth context or localStorage
    return localStorage.getItem('userId') || 'anonymous';
  }
}

export default new WebSocketService();