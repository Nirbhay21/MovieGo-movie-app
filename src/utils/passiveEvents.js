// passiveEvents.js - Must be imported before any other code that adds event listeners

// Check if passive events are supported
export function supportsPassiveEvents() {
  let supportsPassive = false;
  try {
    // Test via a getter in the options object to see if the passive property is accessed
    const opts = Object.defineProperty({}, 'passive', {
      get: function() {
        supportsPassive = true;
        return true;
      }
    });
    // Use an event that's unlikely to be used elsewhere
    window.addEventListener('testPassive', null, opts);
    window.removeEventListener('testPassive', null, opts);
  } catch {
    // Do nothing - passive events not supported
  }
  return supportsPassive;
}

// Apply passive event listeners globally
export function applyPassiveEvents() {
  if (typeof window === 'undefined' || typeof EventTarget === 'undefined') {
    return false; // Not in browser environment
  }

  // Define touch events that should be passive by default
  const EVENTS = ['touchstart', 'touchmove', 'touchend', 'touchcancel'];
  
  // Only proceed if TouchEvent is supported
  if (typeof window.TouchEvent === 'undefined') {
    return false;
  }

  // Store the original method before overriding
  const originalAddEventListener = EventTarget.prototype.addEventListener;
  
  // Override the addEventListener method for all DOM elements
  EventTarget.prototype.addEventListener = function(type, listener, optionsOrCapture) {
    let options = optionsOrCapture;
    
    // Handle the different ways options can be passed
    if (EVENTS.includes(type)) {
      if (options === undefined || options === null) {
        options = { passive: true };
      } else if (typeof options === 'boolean') {
        options = { capture: options, passive: true };
      } else if (typeof options === 'object') {
        // Only set passive to true if it's not explicitly set to false
        if (options.passive !== false) {
          options = { ...options, passive: true };
        }
      }
    }
    
    // Call the original method with our modified options
    return originalAddEventListener.call(this, type, listener, options);
  };

  return true;
}

// Auto-initialize if in browser environment
if (typeof window !== 'undefined') {
  const passiveSupported = supportsPassiveEvents();
  const applied = applyPassiveEvents();
  
  if (applied && passiveSupported) {
    console.log('Passive event listeners enabled for touch events');
  }
}