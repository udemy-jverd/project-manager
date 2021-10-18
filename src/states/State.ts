import Listener from '../types/listener.js';

class State<T> {
  protected listeners: Listener<T>[] = [];

  public addListener(listenerFn: Listener<T>): void {
    this.listeners.push(listenerFn);
  }
}

export default State;
