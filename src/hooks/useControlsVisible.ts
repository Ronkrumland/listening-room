import { useCallback, useEffect, useRef, useState } from "react";

const HIDE_DELAY_MS = 5000;

export function useControlsVisible() {
  const [visible, setVisible] = useState(true);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const revive = useCallback(() => {
    setVisible(true);
    if (timerRef.current !== null) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setVisible(false), HIDE_DELAY_MS);
  }, []);

  useEffect(() => {
    timerRef.current = setTimeout(() => setVisible(false), HIDE_DELAY_MS);

    window.addEventListener("mousemove", revive);
    window.addEventListener("touchstart", revive);

    return () => {
      if (timerRef.current !== null) clearTimeout(timerRef.current);
      window.removeEventListener("mousemove", revive);
      window.removeEventListener("touchstart", revive);
    };
  }, [revive]);

  return visible;
}
