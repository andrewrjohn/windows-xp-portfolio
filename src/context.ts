import { createContext, useContext } from "react";

export type Window = {
  id: number;
  minimized: boolean;
  fullScreen: boolean;
  title: string;
  application: "file_explorer" | "notepad";
  icon: string;
};

export type AppContext = {
  windows: Record<number, Window>;
  activeWindow: number;
  setActiveWindow: (id: number) => void;
  setWindowTitle: (id: number, title: string) => void;
  addWindow: (window: Window) => void;
  closeWindow: (id: number) => void;
  setWindowFullScreen: (id: number, fullScreen: boolean) => void;
  setWindowMinimized: (id: number, minimized: boolean) => void;
};

export const AppContext = createContext<AppContext>({
  windows: {},
  activeWindow: 0,
  addWindow: () => {},
  closeWindow: () => {},
  setWindowFullScreen: () => {},
  setWindowMinimized: () => {},
  setActiveWindow: () => {},
  setWindowTitle: () => {},
});

export const useAppContext = () => {
  return useContext(AppContext);
};
