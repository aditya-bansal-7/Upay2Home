"use client";
import { useEffect, useState } from "react";

export default function useIsPWA() {
  const [isPWA, setIsPWA] = useState(false);

  useEffect(() => {
    const check = () => {
      const isStandalone = window.matchMedia?.("(display-mode: standalone)").matches
        || (window.navigator as any)?.standalone === true;
      setIsPWA(Boolean(isStandalone));
    };

    check();

    // Listen for changes (useful if user installs while app is open)
    const mq = window.matchMedia?.("(display-mode: standalone)");
    const handler = (e: MediaQueryListEvent) => setIsPWA(e.matches);
    try {
      mq?.addEventListener?.("change", handler);
    } catch {
      // older browsers
      mq?.addListener?.(handler as any);
    }

    return () => {
      try {
        mq?.removeEventListener?.("change", handler);
      } catch {
        mq?.removeListener?.(handler as any);
      }
    };
  }, []);

  return isPWA;
}
