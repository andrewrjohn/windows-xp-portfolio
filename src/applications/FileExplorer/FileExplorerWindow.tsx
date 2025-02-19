import { useEffect, useState } from "react";
import BackImage from "../../assets/icons/back.png";
import LocalDiskImage from "../../assets/icons/local_disk.png";
import MyComputerImage from "../../assets/icons/my_computer.png";
import FolderImage from "../../assets/icons/folder.png";

import { useAppContext } from "../../context";
import { WindowShell } from "../../ WindowShell";
import { AboutPage } from "./views/About";
import { ProjectsPage } from "./views/Projects";
import { ContactPage } from "./views/Contact";
import { HomePage } from "./views/Home";

export type FileExplorerPath = "about" | "projects" | "contact" | "";

interface Props {
  id: number;
}

export function FileExplorerWindow(props: Props) {
  const { id } = props;

  const { windows, setWindowTitle } = useAppContext();

  const windowState = windows[id];

  if (!windowState) throw Error("Window not found");

  const [showTools, setShowTools] = useState(false);

  const [path, setPath] = useState<FileExplorerPath>("");

  useEffect(() => {
    setWindowTitle(id, path ? `C:\\ ${path}` : "My Computer");
  }, [path, id]);

  return (
    <WindowShell id={id}>
      <div className="bg-white flex flex-col flex-1 border-4 border-t-0 border-blue-700">
        <div className="flex items-center px-2 bg-gray-200 border-b border-gray-300">
          <div className="first-letter:underline pr-2 opacity-40">File</div>
          <div className="first-letter:underline px-2 opacity-40">Edit</div>
          <div className="first-letter:underline px-2 opacity-40">View</div>
          <div className="first-letter:underline px-2 opacity-40">
            Favorites
          </div>
          <div className="relative">
            <div
              onClick={() => setShowTools(!showTools)}
              className={`first-letter:underline px-2 cursor-pointer ${
                showTools ? "text-white bg-blue-800" : ""
              }`}
            >
              Tools
            </div>
            {showTools && (
              <div className="absolute top-full divide-y divide-gray-300 border border-gray-300 left-0 bg-white">
                {[
                  "JavaScript/TypeScript",
                  "Node JS",
                  "React",
                  "Next JS",
                  "Tailwind CSS",
                  "Rust",
                ].map((tool) => (
                  <div
                    key={tool}
                    className="px-4  hover:bg-blue-800 hover:text-white"
                  >
                    {tool}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="first-letter:underline px-2 opacity-40">Help</div>
        </div>
        <div className="bg-gray-200 border-b pt-2 px-1.5 border-gray-300">
          <button
            onClick={() => setPath("")}
            className="inline-flex items-center gap-1.5 cursor-pointer"
          >
            <img src={BackImage} className="size-6"></img> Back
          </button>
        </div>
        <div className="bg-gray-200 border-b px-1.5 border-gray-300 leading-snug flex items-center py-px gap-1">
          <div className="opacity-40 first-letter:underline">Address</div>
          <div className="bg-white border border-gray-400 flex-1 h-full px-1 flex items-center gap-0.5">
            <button
              onClick={() => setPath("")}
              className="inline-flex items-center gap-1 cursor-pointer"
            >
              <img src={LocalDiskImage} className="size-4" />
              <div className="text-sm tracking-widest">C:\</div>
            </button>
            {path ? (
              <button
                onClick={() => setPath(path)}
                className="capitalize cursor-pointer"
              >
                {path}
              </button>
            ) : null}
          </div>
        </div>
        <div className="flex flex-1">
          {/* Sidebar */}
          <div className="border-r-4 border-gray-200 h-full max-w-50 flex-1">
            <div className="bg-gray-200 px-2">Folders</div>

            <div className="flex flex-col items-start px-1">
              <button
                onClick={() => setPath("")}
                className="flex items-center gap-1 cursor-pointer leading-tight"
              >
                <img src={MyComputerImage} className="size-4 select-none" />
                My Computer
              </button>
              <div className="flex flex-col items-start leading-tight ml-4">
                <button
                  onClick={() => setPath("about")}
                  className="flex items-center gap-1 cursor-pointer"
                >
                  <img src={FolderImage} className="size-4 select-none" />
                  About
                </button>
                <button
                  onClick={() => setPath("projects")}
                  className="flex items-center gap-1 cursor-pointer"
                >
                  <img src={FolderImage} className="size-4 select-none" />
                  Projects
                </button>
                <button
                  onClick={() => setPath("contact")}
                  className="flex items-center gap-1 cursor-pointer"
                >
                  <img src={FolderImage} className="size-4 select-none" />
                  Contact
                </button>
              </div>
            </div>
          </div>

          <div className="p-2 flex-1 h-full">
            <Content path={path} setPath={setPath} />
          </div>
        </div>
      </div>
    </WindowShell>
  );
}

function Content({
  path,
  setPath,
}: {
  path: FileExplorerPath;
  setPath: (path: FileExplorerPath) => void;
}) {
  switch (path) {
    case "about":
      return <AboutPage />;
    case "projects":
      return <ProjectsPage />;
    case "contact":
      return <ContactPage />;
    default:
      return <HomePage setPath={setPath} />;
  }
}
