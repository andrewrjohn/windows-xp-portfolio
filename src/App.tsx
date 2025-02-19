import { BrowserRouter, Route, Routes, useLocation } from "react-router";
import XPImage from "./assets/icons/xp.png";
import LocalDiskImage from "./assets/icons/local_disk.png";
import MyComputerImage from "./assets/icons/my_computer.png";
import UrlImage from "./assets/icons/url.png";
import VolumeImage from "./assets/icons/volume.png";
import RecycleBinImage from "./assets/icons/recycle_bin.png";
import NotepadImage from "./assets/icons/notepad.png";
import { useEffect, useState } from "react";
import { AppContext, useAppContext, Window } from "./context";
import { DynamicWindow } from "./DynamicWindow";

export function App() {
  const [activeWindow, setActiveWindow] = useState(0);
  const [windows, setWindows] = useState<Record<number, Window>>({});

  const addWindow = (window: Window) => {
    setWindows({ ...windows, [window.id]: window });
    setActiveWindow(window.id);
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

  const setWindowTitle = (id: number, title: string) => {
    setWindows({ ...windows, [id]: { ...windows[id], title } });
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
        setWindowTitle,
      }}
    >
      <BrowserRouter>
        <div className="hidden md:block">
          {/* <Routes>
            <Route element={<FileExplorer />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/projects" element={<ProjectsPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
            <Route path="/closed" element={null} />
          </Routes> */}
          {Object.values(windows).map((w) => (
            <DynamicWindow key={w.id} id={w.id} windowState={w} />
          ))}
        </div>
        <div className="md:hidden">
          <Routes>
            <Route
              path="*"
              element={
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
              }
            />
          </Routes>
        </div>
        <Layout />
      </BrowserRouter>
    </AppContext.Provider>
  );
}

function Layout() {
  const { pathname } = useLocation();
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

  const explorerClosed = pathname === "/closed";
  return (
    <div
      className="h-screen w-full flex flex-col bg-[url(/background.jpg)] bg-no-repeat overflow-hidden"
      onClick={(e) => {
        // @ts-expect-error sad
        if (e.target.id !== "desktop-icon") {
          setActiveIcon("");
        }
      }}
      style={{ backgroundSize: "100% 100%" }}
    >
      <div className="flex items-center flex-wrap gap-4">
        <div className="hidden md:block">
          <DesktopIcon
            id="my_computer"
            activeIcon={activeIcon}
            setActiveIcon={setActiveIcon}
            icon={MyComputerImage}
            title="My Computer"
            onClick={() => {
              addWindow({
                id: +new Date(),
                minimized: false,
                fullScreen: false,
                title: "My Computer",
                application: "file_explorer",
                icon: LocalDiskImage,
              });
            }}
          />
        </div>
        <div className="hidden md:block">
          <DesktopIcon
            id="notepad"
            activeIcon={activeIcon}
            setActiveIcon={setActiveIcon}
            icon={NotepadImage}
            title="Notepad"
            onClick={() => {
              addWindow({
                id: +new Date(),
                minimized: false,
                fullScreen: false,
                title: "Notepad",
                application: "notepad",
                icon: NotepadImage,
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
      </div>
      <div className="flex flex-1 justify-end items-end mb-6 mr-4">
        <DesktopIcon
          id="recycle_bin"
          activeIcon={activeIcon}
          setActiveIcon={setActiveIcon}
          icon={RecycleBinImage}
          title="Recycle Bin"
          onClick={() => {}}
        />
      </div>

      {/* Task Bar */}
      <div className="z-10 flex items-center via-blue-700 text-white to-blue-500 bg-gradient-to-b from-blue-500">
        <div className="flex items-center gap-1 bg-gradient-to-b from-green-400 via-green-700 to-green-400 px-1.5 py-0.5 rounded-r-xl text-lg font-semibold italic font-[system-ui] pr-6">
          <img src={XPImage} className="size-6" />
          start
        </div>
        {explorerClosed ? null : (
          <div className="ml-3 py-px items-center gap-1 hidden md:flex">
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
                className={`flex items-center cursor-pointer capitalize gap-1 px-1.5 rounded-sm text-lg pr-12 tracking-wide ${
                  w.minimized || activeWindow !== w.id
                    ? "from-blue-400 via-blue-500 to-blue-400 bg-gradient-to-b"
                    : "bg-blue-800 border border-blue-900 inset-shadow-2x shadow-2xl shadow-black inset-shadow-black"
                }`}
              >
                <img src={w.icon} className="size-5" />
                {w.title}
              </button>
            ))}
          </div>
        )}
        <div className="flex-1" />
        <div className="flex items-center via-blue-500 gap-2 self-stretch text-white to-blue-400 bg-gradient-to-b from-blue-400 pl-2 pr-5 border-l border-blue-800">
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
