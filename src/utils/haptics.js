/**
 * Safe Vibration / Haptic Feedback Utility for Mobile Devices
 */
export function triggerHaptic(duration = 10) {
  try {
    if (typeof window !== 'undefined' && 'navigator' in window && typeof navigator.vibrate === 'function') {
      navigator.vibrate(duration);
    }
  } catch {
    // Ignore unsupported devices or silent permission denials
  }
}
