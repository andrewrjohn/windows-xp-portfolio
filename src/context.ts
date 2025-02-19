import { createContext, useContext } from "react";

export const MinimizedContext = createContext<{
  minimized: boolean;
  setMinimized: (minimized: boolean) => void;
}>({
  minimized: false,
  setMinimized: () => {},
});

export const useMinimized = () => {
  const { minimized, setMinimized } = useContext(MinimizedContext);
  return { minimized, setMinimized };
};
