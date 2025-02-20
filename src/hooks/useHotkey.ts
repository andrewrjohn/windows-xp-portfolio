import { useEffect, useRef } from "react";

export function useHotkey(
  hotkey: string,
  callback: () => void,
  throttleMs: number = 1000
) {
  const holdingCtrl = useRef(false);
  const holdingShift = useRef(false);
  const lastExecuted = useRef<number>(0);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Parse the hotkey string into components
      const keys = hotkey.toLowerCase().split("+");

      const mainKey = keys[keys.length - 1];

      if (event.key === "Control") {
        holdingCtrl.current = true;
      }

      if (event.key === "Shift") {
        holdingShift.current = true;
      }

      // Check modifier keys
      const hasCtrl = keys.includes("ctrl") === holdingCtrl.current;
      const hasShift = keys.includes("shift") === holdingShift.current;

      // Check if the main key matches and all modifiers match their states
      if (event.key.toLowerCase() === mainKey && hasCtrl && hasShift) {
        const now = Date.now();
        if (now - lastExecuted.current >= throttleMs) {
          callback();
          lastExecuted.current = now;
          event.preventDefault();
        }
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.key === "Control") {
        holdingCtrl.current = false;
      }

      if (event.key === "Shift") {
        holdingShift.current = false;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, [hotkey, callback, throttleMs]);
}
