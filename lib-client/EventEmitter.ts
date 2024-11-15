type Listener<T> = (event: T) => void;

export class EventEmitter<T = any> {
  private listeners: Map<string, Listener<T>[]> = new Map();

  on(event: string, listener: Listener<T>): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.push(listener);
    }
  }

  off(event: string, listener: Listener<T>): void {
    if (!this.listeners.has(event)) {
        console.log('no listeners');
        return;
    }

    const listeners = this.listeners.get(event);
    if (listeners) {
      const filteredListeners = listeners.filter((cb) => cb !== listener);
      this.listeners.set(event, filteredListeners);
    }
  }

  emit(event: string, data: T): void {
    const listeners = this.listeners.get(event);
    if (listeners) {
      listeners.forEach((listener) => listener(data));
    }
  }
}

export interface SocketEvent {
  msg: object;
}
console.log('zo');
export const socketEmitter = new EventEmitter<SocketEvent>();
