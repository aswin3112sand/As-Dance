# AS DANCE - Real-time Animation System

## Features Implemented

### 🎬 Real-time Animations
- **WebSocket Connection**: Live communication between frontend and backend
- **Animation Broadcasting**: Animations triggered by one user are visible to all connected users
- **Animation Queue**: Smooth processing of multiple animations
- **6 Animation Types**: Pulse, Shake, Glow, Slide In, Fade In, Bounce

### 🚀 Quick Start
```bash
# Build and run with real-time features
build-realtime.bat
```

### 🎮 Animation Control Panel
- **Live Controls**: Real-time animation panel in top-right corner
- **Target Selection**: Choose which elements to animate
- **Animation Types**: Select from 6 different animation effects
- **Quick Actions**: Pre-configured animation combinations
- **Connection Status**: Visual indicator of WebSocket connection

### 🔧 Technical Implementation

#### Backend (Spring Boot + WebSocket)
- `WebSocketConfig.java` - WebSocket configuration
- `AnimationController.java` - Real-time animation handlers
- `AnimationEvent.java` - Event data structures

#### Frontend (React + STOMP)
- `WebSocketService.js` - WebSocket client service
- `useRealTimeAnimations.js` - Custom React hook for animations
- `RealTimeAnimationPanel.jsx` - Control panel component

### 🎯 Usage Examples

#### Trigger Animation from Code
```javascript
import { useRealTimeAnimations } from './hooks/useRealTimeAnimations.js';

const { triggerAnimation } = useRealTimeAnimations();

// Trigger pulse animation on hero title
triggerAnimation('pulse', '.hero-title');

// Trigger glow effect on buttons
triggerAnimation('glow', '.btn', { intensity: 'high' });
```

#### Available Animation Types
1. **pulse** - Scale up/down effect
2. **shake** - Horizontal shake movement
3. **glow** - Box shadow glow effect
4. **slideIn** - Slide from left with fade
5. **fadeIn** - Fade in with upward movement
6. **bounce** - Bouncing effect

#### Target Selectors
- `.hero-title` - Main hero section title
- `.nav-link` - Navigation menu links
- `.card-anim` - Animated cards
- `.btn` - All buttons
- `.section-anim` - Page sections
- `.fab-container` - Floating action buttons

### 🌐 Real-time Features
- **Multi-user Sync**: Animations are synchronized across all connected users
- **Live Updates**: Real-time user activity tracking
- **Connection Management**: Automatic reconnection on disconnect
- **Performance Optimized**: Animation queue prevents overwhelming the browser

### 🎨 Interactive Elements
- **Navigation Buttons**: Trigger animations on click
- **Scroll Animations**: Enhanced with real-time capabilities
- **User Actions**: Login/register buttons trigger live effects

### 📱 Browser Support
- Modern browsers with WebSocket support
- Fallback to SockJS for older browsers
- Responsive design for mobile devices

### 🔒 Security
- CORS configured for WebSocket connections
- User activity tracking (optional)
- Secure WebSocket endpoints

### 🚀 Performance
- Animation queue prevents browser overload
- Optimized GSAP animations
- Efficient WebSocket message handling
- Reduced motion support for accessibility

## Running the Application

1. **Start Backend**: `cd backend && mvn spring-boot:run`
2. **WebSocket Endpoint**: `ws://localhost:8085/ws`
3. **Frontend**: Served from backend at `http://localhost:8085`
4. **Animation Panel**: Visible in top-right corner when connected

## Development

### Adding New Animations
1. Add animation type to `useRealTimeAnimations.js`
2. Update animation panel options
3. Test with WebSocket broadcasting

### Customizing Targets
1. Add CSS selectors to target elements
2. Update control panel dropdown
3. Ensure elements exist in DOM

The real-time animation system provides a smooth, synchronized experience across all connected users with professional-grade animations and reliable WebSocket communication.