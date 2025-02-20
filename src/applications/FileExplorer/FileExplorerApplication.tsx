import { useEffect, useState } from "react";
import BackImage from "../../assets/icons/back.png";
import LocalDiskImage from "../../assets/icons/local_disk.png";
import MyComputerImage from "../../assets/icons/my_computer.png";
import FolderImage from "../../assets/icons/folder.png";

import { FileExplorerPath, useAppContext } from "../../context";
import { WindowShell } from "../../components/ WindowShell";
import { AboutPage } from "./views/About";
import { ProjectsPage } from "./views/Projects";
import { ContactPage } from "./views/Contact";
import { HomePage } from "./views/Home";
import { Menu } from "../../components/Menu";
import { capitalize } from "../../helpers";
import { RecycleBin } from "./views/RecycleBin";
import RecycleBinImage from "../../assets/icons/recycle_bin.png";
interface Props {
  id: number;
}

export function FileExplorerApplication(props: Props) {
  const { id } = props;

  const { windows, addWindow, setActiveWindow, updateWindow } = useAppContext();

  const windowState = windows[id];

  if (!windowState || windowState.application !== "file_explorer")
    throw Error("Missing or invalid window application type not found");

  const [path, setPath] = useState<FileExplorerPath>(windowState.path || "");

  const newWindow = () => {
    const id = addWindow({ application: "file_explorer" });

    setActiveWindow(id);
  };

  useEffect(() => {
    updateWindow(id, {
      title: path
        ? path === "recycle bin"
          ? "Recycle Bin"
          : `C:\\ ${capitalize(path)}`
        : "My Computer",
      icon: path === "recycle bin" ? RecycleBinImage : LocalDiskImage,
    });
  }, [path, id]);

  return (
    <WindowShell id={id}>
      <div className="bg-white flex flex-col flex-1 border-4 border-t-0 border-blue-700">
        <div className="flex items-center bg-yellow-50 border-b leading-tight border-gray-300">
          <Menu
            trigger={(props) => <button {...props}>File</button>}
            items={[
              {
                label: "New",
                onClick: newWindow,
              },
            ]}
          />
          <div className="first-letter:underline px-2 opacity-40">Edit</div>
          <div className="first-letter:underline px-2 opacity-40">View</div>
          <div className="first-letter:underline px-2 opacity-40">
            Favorites
          </div>
          <Menu
            trigger={(props) => <button {...props}>Tools</button>}
            items={[
              { label: "JavaScript/TypeScript" },
              { label: "Node JS" },
              { label: "React" },
              { label: "Next JS" },
              { label: "Tailwind CSS" },
              { label: "Rust" },
            ]}
          />
          <div className="first-letter:underline px-2 opacity-40">Help</div>
        </div>
        <div className="bg-yellow-50 border-b pt-2 px-1.5 border-gray-300">
          <button
            onClick={() => setPath("")}
            className="inline-flex items-center gap-1.5 cursor-pointer"
          >
            <img src={BackImage} className="size-6"></img> Back
          </button>
        </div>
        <div className="bg-yellow-50 border-b px-1.5 border-gray-300 leading-snug flex items-center py-px gap-1">
          <div className="opacity-40 first-letter:underline">Address</div>
          <div className="bg-white border border-gray-400 flex-1 h-full px-1 flex items-center gap-0.5">
            {path !== "recycle bin" ? (
              <button
                onClick={() => setPath("")}
                className="inline-flex items-center gap-1 cursor-pointer"
              >
                <img src={LocalDiskImage} className="size-4" />
                <div className="text-sm tracking-widest">C:\</div>
              </button>
            ) : null}
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
          <div className="border-r-4 border-yellow-50 h-full max-w-50 flex-1">
            <div className="bg-yellow-50 px-2 border-gray-300 border-b">
              Folders
            </div>

            <div className="flex flex-col items-start px-1">
              <button
                onClick={() => setPath("")}
                className="flex items-center gap-1 cursor-pointer leading-tight"
              >
                <img src={MyComputerImage} className="size-4 select-none" />
                My Computer
              </button>
              <div className="flex flex-col items-start leading-tight ml-4">
                <SidebarLink
                  title="About"
                  activePath={path}
                  path={"about"}
                  setPath={setPath}
                />
                <SidebarLink
                  title="Projects"
                  activePath={path}
                  path={"projects"}
                  setPath={setPath}
                />
                <SidebarLink
                  title="Contact"
                  activePath={path}
                  path={"contact"}
                  setPath={setPath}
                />
              </div>
              <button
                onClick={() => setPath("recycle bin")}
                className="flex items-center gap-1 cursor-pointer leading-tight"
              >
                <img src={RecycleBinImage} className="size-4 select-none" />
                Recycle Bin
              </button>
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

function SidebarLink({
  title,
  activePath,
  path,
  setPath,
}: {
  title: string;
  activePath: FileExplorerPath;
  path: FileExplorerPath;
  setPath: (path: FileExplorerPath) => void;
}) {
  return (
    <button
      onClick={() => setPath(path)}
      className={`flex items-center gap-1 px-2 cursor-pointer`}
    >
      <img src={FolderImage} className="size-4 select-none" />
      <div
        className={`leading-4 px-0.5 ${
          activePath === path ? "bg-yellow-50" : ""
        }`}
      >
        {title}
      </div>
    </button>
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
    case "recycle bin":
      return <RecycleBin />;
    default:
      return <HomePage setPath={setPath} />;
  }
}
