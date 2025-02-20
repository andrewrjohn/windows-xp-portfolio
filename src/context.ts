import { createContext, useContext } from "react";

export type Application = Window["application"];

export type FileExplorerPath =
  | "about"
  | "projects"
  | "contact"
  | "recycle bin"
  | "";

type BaseWindow = {
  id: number;
  minimized: boolean;
  fullScreen: boolean;
  title: string;
  icon: string;
};

type FileExplorerWindow = BaseWindow & {
  application: "file_explorer";
  path?: FileExplorerPath;
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

type NewFileExplorerWindow = BaseNewWindow & {
  application: "file_explorer";
  path?: FileExplorerPath;
};

type NewNotepadWindow = BaseNewWindow & {
  application: "notepad";
  defaultText?: string;
};

export type NewWindow =
  | BaseNewWindow
  | NewNotepadWindow
  | NewFileExplorerWindow;

export type AppContext = {
  windows: Record<number, Window>;
  activeWindow: number;
  setActiveWindow: (id: number) => void;
  addWindow: (window: NewWindow) => number;
  closeWindow: (id: number) => void;
  setWindowFullScreen: (id: number, fullScreen: boolean) => void;
  setWindowMinimized: (id: number, minimized: boolean) => void;
  updateWindow: (
    id: number,
    options: {
      title?: string | ((title: string) => string);
      icon?: string;
    }
  ) => void;
};

export const AppContext = createContext<AppContext>({
  windows: {},
  activeWindow: 0,
  addWindow: () => 0,
  closeWindow: () => {},
  setWindowFullScreen: () => {},
  setWindowMinimized: () => {},
  updateWindow: () => {},
  setActiveWindow: () => {},
});

export const useAppContext = () => {
  return useContext(AppContext);
};
