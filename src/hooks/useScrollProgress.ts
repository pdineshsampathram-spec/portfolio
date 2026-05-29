// Shared scroll state singleton — updated by Lenis, read by R3F useFrame
// Using a plain object (not React state) to avoid re-renders on every scroll tick.

export interface ScrollState {
  progress: number;  // 0 → 1 over full page
  velocity: number;  // px/s, signed
}

// Module-level singleton so any component can import and read without prop drilling
export const scrollState: ScrollState = {
  progress: 0,
  velocity: 0,
};
