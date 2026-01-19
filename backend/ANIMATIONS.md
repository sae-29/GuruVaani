# Guru Vaani Animation Specifications

This document defines all animations used in Guru Vaani, following low-data, performant principles.

## Animation Principles

- **Duration**: 150–300ms (fast interactions), 400–600ms (completion states)
- **Easing**: `ease-out` or `linear` (no bounce/ease-in-out)
- **Performance**: CSS transforms/opacity only (GPU-accelerated)
- **Accessibility**: Respect `prefers-reduced-motion`
- **Mobile-first**: Optimized for low-end Android devices

---

## 1️⃣ OFFLINE / SYNC ANIMATIONS

### Sync Icon States

**Offline State** (Static)
- No animation
- Icon: Cloud with slash

**Syncing State**
```css
@keyframes sync-rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.syncing-icon {
  animation: sync-rotate 1s linear infinite;
}
```
- Duration: 1s (continuous rotation)
- Easing: `linear`
- Reduced motion: Remove animation, show static icon

**Synced State**
```css
@keyframes checkmark-fade {
  from { 
    opacity: 0;
    transform: scale(0.8);
  }
  to { 
    opacity: 1;
    transform: scale(1);
  }
}

.synced-icon {
  animation: checkmark-fade 200ms ease-out;
}
```
- Duration: 200ms
- Easing: `ease-out`
- Reduced motion: Instant appearance

### Offline Banner

**Slide Down**
```css
@keyframes slide-down {
  from {
    transform: translateY(-100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.offline-banner {
  animation: slide-down 250ms ease-out;
}
```
- Duration: 250ms
- Easing: `ease-out`
- Reduced motion: Instant appearance

**Dismiss (Slide Up)**
```css
@keyframes slide-up {
  from {
    transform: translateY(0);
    opacity: 1;
  }
  to {
    transform: translateY(-100%);
    opacity: 0;
  }
}

.offline-banner.dismissing {
  animation: slide-up 200ms ease-out;
}
```
- Duration: 200ms
- Reduced motion: Instant removal

---

## 2️⃣ DIARY ENTRY ANIMATIONS

### New Entry Button Pulse

```css
@keyframes subtle-pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.03); }
}

.new-entry-button {
  animation: subtle-pulse 8s ease-in-out infinite;
}

@media (prefers-reduced-motion: reduce) {
  .new-entry-button {
    animation: none;
  }
}
```
- Duration: 8s (full cycle)
- Easing: `ease-in-out`
- Reduced motion: Remove animation

### Submit Button Press

```css
.submit-button:active {
  transform: scale(0.95);
  transition: transform 100ms ease-out;
}
```
- Duration: 100ms
- Easing: `ease-out`
- Reduced motion: Keep (essential feedback)

### Success Checkmark

```css
@keyframes checkmark-draw {
  0% {
    stroke-dashoffset: 100;
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    stroke-dashoffset: 0;
    opacity: 1;
  }
}

.success-checkmark {
  stroke-dasharray: 100;
  stroke-dashoffset: 100;
  animation: checkmark-draw 400ms ease-out forwards;
}
```
- Duration: 400ms
- Easing: `ease-out`
- Reduced motion: Instant appearance

### Voice Recording Pulse

```css
@keyframes recording-pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.8;
  }
}

.recording-button.recording {
  animation: recording-pulse 1s ease-in-out infinite;
}
```
- Duration: 1s (continuous)
- Easing: `ease-in-out`
- Reduced motion: Static pulsing color change

---

## 3️⃣ AI RESPONSE & LOADING STATES

### Typing Indicator (Three Dots)

```css
@keyframes dot-fade {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 1; }
}

.ai-typing-dot:nth-child(1) {
  animation: dot-fade 1.4s ease-in-out infinite;
}

.ai-typing-dot:nth-child(2) {
  animation: dot-fade 1.4s ease-in-out infinite 0.2s;
}

.ai-typing-dot:nth-child(3) {
  animation: dot-fade 1.4s ease-in-out infinite 0.4s;
}
```
- Duration: 1.4s (per dot)
- Easing: `ease-in-out`
- Reduced motion: Static dots

### Suggestion Cards Slide Up

```css
@keyframes slide-up-stagger {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.ai-suggestion-card {
  animation: slide-up-stagger 200ms ease-out forwards;
}

.ai-suggestion-card:nth-child(1) { animation-delay: 0ms; }
.ai-suggestion-card:nth-child(2) { animation-delay: 50ms; }
.ai-suggestion-card:nth-child(3) { animation-delay: 100ms; }
```
- Duration: 200ms per card
- Stagger: 50ms between cards
- Easing: `ease-out`
- Reduced motion: Instant appearance

### Skeleton Loader Shimmer

```css
@keyframes shimmer {
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
}

.skeleton-loader {
  background: linear-gradient(
    90deg,
    #f0f0f0 0%,
    #e0e0e0 50%,
    #f0f0f0 100%
  );
  background-size: 1000px 100%;
  animation: shimmer 1.5s linear infinite;
}
```
- Duration: 1.5s (loop)
- Easing: `linear`
- Reduced motion: Static gray background

---

## 4️⃣ TRAINING MODULE PROGRESS

### Progress Bar Fill

```css
.progress-bar-fill {
  transition: width 200ms linear;
}
```
- Duration: 200ms
- Easing: `linear`
- Reduced motion: Instant update

### Module Completion Confetti

```css
@keyframes confetti-burst {
  0% {
    transform: scale(0) rotate(0deg);
    opacity: 1;
  }
  100% {
    transform: scale(1.5) rotate(360deg);
    opacity: 0;
  }
}

.confetti-particle {
  animation: confetti-burst 600ms ease-out forwards;
}
```
- Duration: 600ms
- Easing: `ease-out`
- Reduced motion: Simple checkmark only

### Badge Flip-In

```css
@keyframes badge-flip {
  from {
    transform: rotateY(90deg);
    opacity: 0;
  }
  to {
    transform: rotateY(0deg);
    opacity: 1;
  }
}

.badge-earned {
  animation: badge-flip 400ms ease-out;
}
```
- Duration: 400ms
- Easing: `ease-out`
- Reduced motion: Fade-in only (no rotation)

---

## 5️⃣ COMMUNITY INTERACTIONS

### Like Button Bounce

```css
@keyframes like-bounce {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.2); }
}

.like-button.liked {
  animation: like-bounce 300ms ease-out;
}
```
- Duration: 300ms
- Easing: `ease-out`
- Reduced motion: Color change only

### New Post Card

```css
@keyframes post-fade-in {
  from {
    transform: translateY(10px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.new-post-card {
  animation: post-fade-in 150ms ease-out;
}
```
- Duration: 150ms
- Easing: `ease-out`
- Reduced motion: Instant appearance

---

## 6️⃣ ADMIN DASHBOARD ANIMATIONS

### Chart Bar Growth

```css
@keyframes bar-grow {
  from {
    transform: scaleY(0);
    transform-origin: bottom;
  }
  to {
    transform: scaleY(1);
  }
}

.chart-bar {
  animation: bar-grow 300ms ease-out;
}

.chart-bar:nth-child(1) { animation-delay: 0ms; }
.chart-bar:nth-child(2) { animation-delay: 50ms; }
.chart-bar:nth-child(3) { animation-delay: 100ms; }
```
- Duration: 300ms per bar
- Stagger: 50ms
- Easing: `ease-out`
- Reduced motion: Instant appearance

### Cluster Cards Stagger

```css
@keyframes cluster-fade-in {
  from {
    transform: translateX(-20px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.cluster-card {
  animation: cluster-fade-in 200ms ease-out forwards;
}

.cluster-card:nth-child(1) { animation-delay: 0ms; }
.cluster-card:nth-child(2) { animation-delay: 50ms; }
.cluster-card:nth-child(3) { animation-delay: 100ms; }
```
- Duration: 200ms per card
- Stagger: 50ms
- Easing: `ease-out`
- Reduced motion: Instant appearance

### Priority Alert Pulse

```css
@keyframes alert-pulse {
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(255, 0, 0, 0.7);
  }
  50% {
    box-shadow: 0 0 0 10px rgba(255, 0, 0, 0);
  }
}

.priority-alert.critical {
  animation: alert-pulse 2s ease-in-out infinite;
}
```
- Duration: 2s (loop, every 10s trigger)
- Easing: `ease-in-out`
- Reduced motion: Static border color

---

## 7️⃣ GLOBAL TRANSITIONS

### Page Transition

```css
@keyframes page-fade {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.page-container {
  animation: page-fade 200ms ease-out;
}
```
- Duration: 200ms
- Easing: `ease-out`
- Reduced motion: Instant

### Modal Slide Up

```css
@keyframes modal-slide-up {
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.modal-container {
  animation: modal-slide-up 250ms ease-out;
}
```
- Duration: 250ms
- Easing: `ease-out`
- Reduced motion: Instant appearance

### Hover Shadow Elevation (Desktop)

```css
.card {
  transition: box-shadow 150ms ease-out;
}

.card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
```
- Duration: 150ms
- Easing: `ease-out`
- Reduced motion: Keep (essential feedback)

---

## Implementation Notes

### React Native (Mobile App)

```typescript
import { Animated, Easing } from 'react-native';

// Example: Sync icon rotation
const rotateAnim = useRef(new Animated.Value(0)).current;

useEffect(() => {
  Animated.loop(
    Animated.timing(rotateAnim, {
      toValue: 1,
      duration: 1000,
      easing: Easing.linear,
      useNativeDriver: true,
    })
  ).start();
}, []);

const rotation = rotateAnim.interpolate({
  inputRange: [0, 1],
  outputRange: ['0deg', '360deg'],
});
```

### React/Web (Teacher Web App)

```typescript
// Use CSS classes or Framer Motion
import { motion } from 'framer-motion';

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.2, ease: 'easeOut' }}
>
  {content}
</motion.div>
```

### Reduce Motion Support

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Performance Checklist

- ✅ Use `transform` and `opacity` only (GPU-accelerated)
- ✅ Avoid animating `width`, `height`, `top`, `left`
- ✅ Use `will-change` sparingly
- ✅ Limit concurrent animations to 3–4
- ✅ Test on low-end Android devices
- ✅ Respect `prefers-reduced-motion`
- ✅ Keep animations under 300ms for interactions
- ✅ Use `requestAnimationFrame` for complex animations

---

## Animation Testing

1. Test on Android 7+ devices
2. Verify with `prefers-reduced-motion` enabled
3. Check performance with Chrome DevTools Performance tab
4. Ensure animations don't block main thread
5. Verify animations pause when tab is inactive
