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
import { createContext, useContext, useState } from "react";

const MinimizedContext = createContext<{
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

export function App() {
  const [minimized, setMinimized] = useState(false);

  return (
    <MinimizedContext.Provider value={{ minimized, setMinimized }}>
      <BrowserRouter>
        <Routes>
          <Route element={<FileExplorer />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
          <Route path="/closed" element={null} />
        </Routes>
        <Layout />
      </BrowserRouter>
    </MinimizedContext.Provider>
  );
}

function Layout() {
  const { minimized, setMinimized } = useMinimized();
  const { pathname } = useLocation();
  const [didClickIcon, setDidClickIcon] = useState(false);

  const navigate = useNavigate();

  const explorerClosed = pathname === "/closed";
  return (
    <div
      className="h-screen w-full bg-[url(/background.jpg)] bg-no-repeat overflow-hidden"
      onClick={(e) => {
        // @ts-expect-error sad
        if (e.target.id !== "desktop-icon") {
          setDidClickIcon(false);
        }
      }}
      style={{ backgroundSize: "100% 100%" }}
    >
      <button
        onDoubleClick={() => {
          setDidClickIcon(true);
          navigate("/");
        }}
        onClick={() => {
          setDidClickIcon(true);
        }}
        id="desktop-icon"
        className="flex flex-col ml-4 mt-4"
      >
        <img
          src={MyComputerImage}
          className="size-12 drop-shadow-2xl shadow-black pointer-events-none"
        />
        <div
          className={
            explorerClosed && !didClickIcon
              ? "text-white drop-shadow-[2px_0px_1px_black] pointer-events-none"
              : "text-white bg-blue-900 leading-tight px-1 pointer-events-none"
          }
        >
          My Computer
        </div>
      </button>

      {/* Task Bar */}
      <div className="absolute bottom-0 left-0 right-0 z-10 flex items-center via-blue-700 text-white to-blue-500 bg-gradient-to-b from-blue-500">
        <div className="flex items-center gap-1 bg-gradient-to-b from-green-400 via-green-700 to-green-400 px-1.5 py-0.5 rounded-r-xl text-lg font-semibold italic font-[system-ui] pr-6">
          <img src={XPImage} className="size-6" />
          start
        </div>
        {explorerClosed ? null : (
          <div className="ml-3 py-px flex items-center">
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
      </div>
    </div>
  );
}
