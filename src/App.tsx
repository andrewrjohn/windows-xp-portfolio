import {
  BrowserRouter,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router";
import { FileExplorer } from "./FileExplorer";
import { HomePage } from "./pages/Home";
import { ProjectsPage } from "./pages/Projects";
import { NotFoundPage } from "./pages/NotFound";
import { ContactPage } from "./pages/Contact";
import XPImage from "./assets/icons/xp.png";
import LocalDiskImage from "./assets/icons/local_disk.png";
import MyComputerImage from "./assets/icons/my_computer.png";
import UrlImage from "./assets/icons/url.png";
import VolumeImage from "./assets/icons/volume.png";
import RecycleBinImage from "./assets/icons/recycle_bin.png";

import { useEffect, useState } from "react";
import { AboutPage } from "./pages/About";
import { MinimizedContext, useMinimized } from "./context";

export function App() {
  const [minimized, setMinimized] = useState(false);

  return (
    <MinimizedContext.Provider value={{ minimized, setMinimized }}>
      <BrowserRouter>
        <div className="hidden md:block">
          <Routes>
            <Route element={<FileExplorer />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/projects" element={<ProjectsPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
            <Route path="/closed" element={null} />
          </Routes>
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
    </MinimizedContext.Provider>
  );
}

function Layout() {
  const { minimized, setMinimized } = useMinimized();
  const { pathname } = useLocation();
  const [activeIcon, setActiveIcon] = useState("my_computer");
  const [time, setTime] = useState(
    new Date().toLocaleTimeString(undefined, { timeStyle: "short" })
  );

  useEffect(() => {
    const updateTime = () => {
      setTime(new Date().toLocaleTimeString(undefined, { timeStyle: "short" }));
    };

    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  const navigate = useNavigate();

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
              navigate("/");
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
          <div className="ml-3 py-px items-center  hidden md:flex">
            <button
              onClick={() => setMinimized(!minimized)}
              className={`flex items-center cursor-pointer gap-1 px-1.5 rounded-sm text-lg pr-12 tracking-wide ${
                minimized
                  ? "from-blue-400 via-blue-500 to-blue-400 bg-gradient-to-b"
                  : "bg-blue-800 border border-blue-900 inset-shadow-2x shadow-2xl shadow-black inset-shadow-black"
              }`}
            >
              <img src={LocalDiskImage} className="size-5" />
              Local Disk (C:)
            </button>
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
