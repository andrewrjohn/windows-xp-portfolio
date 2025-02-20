import { createContext, useContext } from "react";

export type Application = Window["application"];

type BaseWindow = {
  id: number;
  minimized: boolean;
  fullScreen: boolean;
  title: string;
  icon: string;
};

type FileExplorerWindow = BaseWindow & {
  application: "file_explorer";
};

type NotepadWindow = BaseWindow & {
  application: "notepad";
  defaultText?: string;
};

export type Window = FileExplorerWindow | NotepadWindow;

type BaseNewWindow = {
  application: Application;
  icon?: string;
  title?: string;
};

type NewNotepadWindow = BaseNewWindow & {
  application: "notepad";
  defaultText?: string;
};

export type NewWindow = BaseNewWindow | NewNotepadWindow;

export type AppContext = {
  windows: Record<number, Window>;
  activeWindow: number;
  setActiveWindow: (id: number) => void;
  setWindowTitle: (
    id: number,
    title: string | ((title: string) => string)
  ) => void;
  addWindow: (window: NewWindow) => number;
  closeWindow: (id: number) => void;
  setWindowFullScreen: (id: number, fullScreen: boolean) => void;
  setWindowMinimized: (id: number, minimized: boolean) => void;
};

export const AppContext = createContext<AppContext>({
  windows: {},
  activeWindow: 0,
  addWindow: () => 0,
  closeWindow: () => {},
  setWindowFullScreen: () => {},
  setWindowMinimized: () => {},
  setActiveWindow: () => {},
  setWindowTitle: () => {},
});

export const useAppContext = () => {
  return useContext(AppContext);
};
