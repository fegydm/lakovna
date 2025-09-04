// File: front/src/utils/store.utils.ts
// Last change: Fixed TypeScript errors and simplified state update logic.

import { useSyncExternalStore } from "react";

export function createStore<T>(initialState: T) {
  let state = initialState;
  const listeners = new Set<() => void>();

  const getState = (): T => state;

  const setState = (updater: Partial<T> | ((prev: T) => T)) => {
    // Zjednodušená logika na určenie nového stavu
    const nextState = typeof updater === "function" ? updater(state) : { ...state, ...updater };

    // Nový stav by mal byť vždy spojený s predchádzajúcim stavom,
    // aby sa predišlo premazaniu hodnôt.
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