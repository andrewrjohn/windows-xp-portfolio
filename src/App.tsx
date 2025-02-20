import XPImage from "./assets/icons/xp.png";
import LocalDiskImage from "./assets/icons/local_disk.png";
import MyComputerImage from "./assets/icons/my_computer.png";
import UrlImage from "./assets/icons/url.png";
import VolumeImage from "./assets/icons/volume.png";
import RecycleBinImage from "./assets/icons/recycle_bin.png";
import NotepadImage from "./assets/icons/notepad.png";
import TxtImage from "./assets/icons/txt.png";

import { useEffect, useRef, useState } from "react";
import {
  AppContext,
  Application,
  NewWindow,
  useAppContext,
  Window,
} from "./context";
import { DynamicWindow } from "./components/DynamicWindow";

type ApplicationDefault = Pick<Window, "icon" | "title">;

const APPLICATION_DEFAULTS: Record<Application, ApplicationDefault> = {
  file_explorer: {
    icon: LocalDiskImage,
    title: "My Computer",
  },
  notepad: {
    icon: NotepadImage,
    title: "Untitled - Notepad",
  },
};

export function App() {
  const [activeWindow, setActiveWindow] = useState(0);
  const [windows, setWindows] = useState<Record<number, Window>>({});

  const addWindow = (window: NewWindow) => {
    const id = +new Date();

    const newWindow: Window = {
      ...APPLICATION_DEFAULTS[window.application],
      ...window,
      id,
      minimized: false,
      fullScreen: false,
    };

    setWindows({ ...windows, [id]: newWindow });
    setActiveWindow(id);

    return id;
  };

  const closeWindow = (id: number) => {
    const newWindows = { ...windows };
    delete newWindows[id];
    setWindows(newWindows);
  };

  const setWindowFullScreen = (id: number, fullScreen: boolean) => {
    setWindows({ ...windows, [id]: { ...windows[id], fullScreen } });
  };

  const setWindowMinimized = (id: number, minimized: boolean) => {
    setWindows({ ...windows, [id]: { ...windows[id], minimized } });

    if (minimized) {
      setActiveWindow(0);
    }
  };

  const updateWindow = (
    id: number,
    options: {
      title?: string | ((title: string) => string);
      icon?: string;
    }
  ) => {
    const existingWindow = windows[id];

    const { title, icon } = options;

    let newTitle = existingWindow.title;
    let newIcon = existingWindow.icon;

    if (title) {
      newTitle =
        typeof title === "string" ? title : title(existingWindow.title);
    }

    if (icon) {
      newIcon = icon;
    }

    setWindows({
      ...windows,
      [id]: { ...windows[id], title: newTitle, icon: newIcon },
    });
  };

  return (
    <AppContext.Provider
      value={{
        activeWindow,
        setActiveWindow,
        addWindow,
        closeWindow,
        windows,
        setWindowFullScreen,
        setWindowMinimized,
        updateWindow,
      }}
    >
      <div className="hidden sm:block">
        {Object.values(windows).map((w) => (
          <DynamicWindow key={w.id} id={w.id} windowState={w} />
        ))}
      </div>
      <div className="sm:hidden">
        <div className="flex flex-col items-center justify-center  absolute inset-0">
          <div className="bg-white px-2 py-1">
            <h1 className="text-xl font-bold">
              This site is not supported on mobile.
            </h1>
            <p className="text-gray-500">
              Please use a desktop computer to view this site.
            </p>
          </div>
        </div>
      </div>
      <Desktop />
    </AppContext.Provider>
  );
}

function Desktop() {
  const [activeIcon, setActiveIcon] = useState("");
  const [time, setTime] = useState(
    new Date().toLocaleTimeString(undefined, { timeStyle: "short" })
  );

  const {
    windows,
    setWindowMinimized,
    addWindow,
    activeWindow,
    setActiveWindow,
  } = useAppContext();

  useEffect(() => {
    const updateTime = () => {
      setTime(new Date().toLocaleTimeString(undefined, { timeStyle: "short" }));
    };

    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  const mouseDownRef = useRef(false);
  const [dragStartPos, setDragStartPos] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [dragEndPos, setDragEndPos] = useState<{ x: number; y: number } | null>(
    null
  );

  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      mouseDownRef.current = true;
      setDragStartPos({ x: e.clientX, y: e.clientY });
    };

    const handleMouseUp = () => {
      mouseDownRef.current = false;

      setDragStartPos(null);
      setDragEndPos(null);
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (mouseDownRef.current) {
        setDragEndPos({ x: e.clientX, y: e.clientY });
      }
    };

    const wallpaper = document.querySelector<HTMLDivElement>("#wallpaper");

    if (!wallpaper) return;

    wallpaper.addEventListener("mousedown", handleMouseDown);
    wallpaper.addEventListener("mouseup", handleMouseUp);
    wallpaper.addEventListener("mousemove", handleMouseMove);

    return () => {
      wallpaper.removeEventListener("mousedown", handleMouseDown);
      wallpaper.removeEventListener("mouseup", handleMouseUp);
      wallpaper.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const dragBoxWidth = Math.abs(
    dragStartPos && dragEndPos ? dragEndPos.x - dragStartPos.x : 0
  );

  const dragBoxHeight = Math.abs(
    dragStartPos && dragEndPos ? dragEndPos.y - dragStartPos.y : 0
  );

  const draggingLeftToRight = (dragEndPos?.x ?? 0) > (dragStartPos?.x ?? 0);
  const draggingTopToBottom = (dragEndPos?.y ?? 0) > (dragStartPos?.y ?? 0);

  return (
    <div
      className="h-screen w-full flex flex-col bg-[url(/background.jpg)] bg-no-repeat overflow-hidden select-none"
      onClick={(e) => {
        // @ts-expect-error sad
        if (e.target.id !== "desktop-icon") {
          setActiveIcon("");
        }
      }}
      style={{ backgroundSize: "100% 100%" }}
      id="wallpaper"
    >
      {dragBoxHeight && dragBoxWidth ? (
        <div
          style={{
            height: `${dragBoxHeight}px`,
            width: `${dragBoxWidth}px`,
            position: "absolute",
            top: dragStartPos?.y,
            left: dragStartPos?.x,
            transform:
              !draggingLeftToRight || !draggingTopToBottom
                ? `translate(${!draggingLeftToRight ? "-100%" : "0px"}, ${
                    !draggingTopToBottom ? "-100%" : "0px"
                  })`
                : undefined,
          }}
          className="bg-blue-400/50"
        />
      ) : null}
      <div className="flex items-center flex-wrap gap-4">
        <div className="hidden sm:block">
          <DesktopIcon
            id="my_computer"
            activeIcon={activeIcon}
            setActiveIcon={setActiveIcon}
            icon={MyComputerImage}
            title="My Computer"
            onClick={() => {
              addWindow({
                application: "file_explorer",
              });
            }}
          />
        </div>
        <div className="hidden sm:block">
          <DesktopIcon
            id="notepad"
            activeIcon={activeIcon}
            setActiveIcon={setActiveIcon}
            icon={NotepadImage}
            title="Notepad"
            onClick={() => {
              addWindow({
                application: "notepad",
              });
            }}
          />
        </div>

        <DesktopIcon
          id="repo"
          activeIcon={activeIcon}
          setActiveIcon={setActiveIcon}
          icon={UrlImage}
          title="GitHub Repo"
          onClick={() => {
            window.open("https://github.com/andrewrjohn/windows-xp", "_blank");
          }}
        />
        <DesktopIcon
          id="txt_file"
          activeIcon={activeIcon}
          setActiveIcon={setActiveIcon}
          icon={TxtImage}
          title="hello.txt"
          onClick={() => {
            addWindow({
              application: "notepad",
              defaultText: "Hello, world!",
              title: "hello.txt",
            });
          }}
        />
      </div>
      <div className="flex flex-1 justify-end items-end mb-6 mr-4">
        <DesktopIcon
          id="recycle_bin"
          activeIcon={activeIcon}
          setActiveIcon={setActiveIcon}
          icon={RecycleBinImage}
          title="Recycle Bin"
          onClick={() => {
            addWindow({
              application: "file_explorer",
              path: "recycle bin",
              title: "Recycle Bin",
              icon: RecycleBinImage,
            });
          }}
        />
      </div>

      {/* Task Bar */}
      <div className="z-10 flex items-center via-blue-700 text-white to-blue-500 bg-gradient-to-b from-blue-500">
        <div className="flex overflow-hidden flex-shrink-0 items-center px-1.5 py-0.5 text-lg font-semibold italic font-[system-ui] pr-6 relative">
          <div className="flex items-center z-10 gap-1">
            <img src={XPImage} className="size-6" />
            start
          </div>
          <div className="h-[200%] w-[100%] border-r border-green-800 bg-gradient-to-b  from-green-400 via-green-700 to-green-400 top-1/2 absolute inset-0 -translate-y-1/2 rounded-r-full" />
        </div>
        <div className="ml-3 py-px w-full items-center gap-1 hidden sm:flex overflow-hidden">
          {Object.values(windows).map((w) => (
            <button
              key={w.id}
              onClick={() => {
                if (activeWindow === w.id) {
                  setWindowMinimized(w.id, !w.minimized);
                } else {
                  setWindowMinimized(w.id, false);
                  setActiveWindow(w.id);
                }
              }}
              className={`flex items-center min-w-0 cursor-pointer gap-1 px-1.5 rounded-sm text-lg w-full max-w-40 tracking-wide ${
                w.minimized || activeWindow !== w.id
                  ? "from-blue-400 via-blue-500 to-blue-400 bg-gradient-to-b"
                  : "bg-blue-800 border border-blue-900 inset-shadow-2x shadow-2xl shadow-black inset-shadow-black"
              }`}
            >
              <img src={w.icon} className="size-5" />
              <span className="truncate">{w.title}</span>
            </button>
          ))}
        </div>
        <div className="flex-1" />
        <div className="flex items-center flex-shrink-0 via-blue-500 gap-2 whitespace-nowrap self-stretch text-white to-blue-400 bg-gradient-to-b from-blue-400 pl-2 pr-5 border-l border-blue-800">
          <img src={VolumeImage} className="size-4" />
          {time}
        </div>
      </div>
    </div>
  );
}

function DesktopIcon({
  icon,
  id,
  title,
  onClick,
  setActiveIcon,
  activeIcon,
}: {
  id: string;
  icon: string;
  title: string;
  onClick: () => void;
  setActiveIcon: (icon: string) => void;
  activeIcon: string;
}) {
  return (
    <button
      onDoubleClick={() => {
        setActiveIcon(id);
        onClick();
      }}
      onClick={() => {
        setActiveIcon(id);
      }}
      id="desktop-icon"
      className="flex items-center flex-col ml-4 mt-4"
    >
      <img
        src={icon}
        className="size-9 drop-shadow-2xl shadow-black pointer-events-none"
      />
      <div
        className={`px-1 pointer-events-none leading-tight ${
          activeIcon === id
            ? "text-white bg-blue-900"
            : "text-white drop-shadow-[2px_0px_1px_black]"
        }`}
      >
        {title}
      </div>
    </button>
  );
}
