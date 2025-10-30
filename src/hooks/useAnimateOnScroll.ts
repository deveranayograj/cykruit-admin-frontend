"use client";
import { useInView } from "react-intersection-observer";
import { useState, useEffect } from "react";

/**
 * Custom hook that triggers an animation or value change when the element scrolls into view.
 * @param threshold - How much of the element must be visible before triggering (0 to 1)
 * @returns ref, inView, and triggered (fires only once)
 */
export function useAnimateOnScroll(threshold: number = 0.3) {
  const { ref, inView } = useInView({ threshold, triggerOnce: true });
  const [triggered, setTriggered] = useState(false);

  useEffect(() => {
    if (inView && !triggered) setTriggered(true);
  }, [inView, triggered]);

  return { ref, inView: triggered };
}
