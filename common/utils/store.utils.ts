// File: common/utils/store.utils.ts
// Last change: Refactored store utility to be consistent with project naming conventions

import { useSyncExternalStore } from "react";

export function create_store<T>(initial_state: T) {
  let state = initial_state;
  const listeners = new Set<() => void>();

  const get_state = (): T => state;

  const set_state = (updater: Partial<T> | ((prev: T) => T)) => {
    const next_state =
      typeof updater === "function"
        ? (updater as (prev: T) => T)(state)
        : { ...state, ...updater };

    state =
      typeof updater === "function"
        ? (next_state as T)
        : { ...state, ...(next_state as Partial<T>) };

    listeners.forEach((listener) => listener());
  };

  const subscribe = (listener: () => void) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };

  const use_store = <U>(selector: (s: T) => U): U =>
    useSyncExternalStore(subscribe, () => selector(state));

  return { get_state, set_state, subscribe, use_store };
}