// File: common/utils/createStore.ts
// Minimal event-driven store inspired by Zustand

import { useSyncExternalStore } from "react";

export function createStore<T>(initialState: T) {
  let state = initialState;
  const listeners = new Set<() => void>();

  const getState = () => state;

  const setState = (updater: Partial<T> | ((prev: T) => T)) => {
    const nextState =
      typeof updater === "function"
        ? (updater as (prev: T) => T)(state)
        : { ...state, ...updater };

    state = { ...state, ...nextState };
    listeners.forEach((listener) => listener());
  };

  const subscribe = (listener: () => void) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };

  const useStore = <U>(selector: (s: T) => U): U =>
    useSyncExternalStore(subscribe, () => selector(state));

  return { getState, setState, subscribe, useStore };
}
