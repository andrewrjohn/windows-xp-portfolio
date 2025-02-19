import { DndContext, useDraggable } from "@dnd-kit/core";
import { Resizable } from "re-resizable";
import { useMemo, useState } from "react";
import ExitImage from "./assets/icons/exit.png";
import MaximizeImage from "./assets/icons/maximize.png";
import MinimizeImage from "./assets/icons/minimize.png";
import BackImage from "./assets/icons/back.png";
import LocalDiskImage from "./assets/icons/local_disk.png";
import MyComputerImage from "./assets/icons/my_computer.png";
import FolderImage from "./assets/icons/folder.png";

import { Link, Outlet, useLocation } from "react-router";
import { useMinimized } from "./context";

export function FileExplorer() {
  const [coords, setCoords] = useState<{ left: number; top: number }>({
    left: 100,
    top: 100,
  });

  const [maximized, setMaximized] = useState(false);

  return (
    <DndContext
      autoScroll={false}
      onDragEnd={(e) => {
        setMaximized(false);

        setCoords((prev) => ({
          left: prev.left + e.delta.x,
          top: prev.top + e.delta.y,
        }));
      }}
    >
      <ExplorerWindow
        {...coords}
        setCoords={setCoords}
        maximized={maximized}
        setMaximized={setMaximized}
      />
    </DndContext>
  );
}

function ExplorerWindow({
  top,
  left,
  maximized,
  setCoords,
  setMaximized,
}: {
  top: number;
  left: number;
  maximized: boolean;
  setCoords: (coords: { top: number; left: number }) => void;
  setMaximized: (maximized: boolean) => void;
}) {
  const { minimized, setMinimized } = useMinimized();

  const [showTools, setShowTools] = useState(false);
  const [size, setSize] = useState({ height: "480px", width: "680px" });
  const [lastSize, setLastSize] = useState({ height: "480px", width: "680px" });
  const [lastCoords, setLastCoords] = useState({ top: 0, left: 0 });

  const { attributes, listeners, setNodeRef, transform, active } = useDraggable(
    {
      id: "draggable",
    }
  );

  const { pathname } = useLocation();

  const style = useMemo(() => {
    const baseStyle = {
      transition: !active ? "all 0.150s ease-in-out" : undefined,
      transform: minimized
        ? "translate3d(calc(-100vw + 61vw), calc(100vh - 50px), 0) scale(0)"
        : transform
        ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
        : undefined,
    };

    return baseStyle;
  }, [transform, minimized, active]);

  const onMaximize = () => {
    if (maximized) {
      // Restore last size
      setSize(lastSize);

      setCoords({
        top: lastCoords.top,
        left: lastCoords.left,
      });
    } else {
      // Maximize
      setLastSize({
        height: size.height,
        width: size.width,
      });

      setLastCoords({
        top,
        left,
      });

      setSize({ height: "100%", width: "100%" });

      setCoords({
        top: 0,
        left: 0,
      });
    }

    setMaximized(!maximized);
  };

  const path = pathname.replace("/", "");

  return (
    <div
      ref={setNodeRef}
      className={`absolute z-10  ${
        active ? "" : "transition-all duration-150"
      }`}
      style={{ ...style, top, left, height: size.height, width: size.width }}
      {...attributes}
    >
      <Resizable
        size={size}
        onResizeStop={(_e, _direction, _ref, d) => {
          const height = Number(size.height.replace("px", ""));
          const width = Number(size.width.replace("px", ""));

          setSize({
            height: (height + d.height).toString() + "px",
            width: (width + d.width).toString() + "px",
          });
        }}
        bounds="window"
        enable={{
          left: false,
          bottomLeft: false,
          topLeft: false,
          top: false,
          bottom: true,
          bottomRight: true,
          right: true,
          topRight: true,
        }}
      >
        <div className="flex flex-col h-full">
          <div className="h-8 flex items-center justify-between via-blue-700 px-1.5 text-white to-blue-500 bg-gradient-to-b from-blue-500 rounded-t-lg">
            <div {...listeners} className="flex items-center flex-1">
              <div className="text-lg">
                {path ? (
                  <span className="capitalize">{path}</span>
                ) : (
                  "Local Disk (C:)"
                )}
              </div>
            </div>
            <div className="flex items-center gap-0.5 text-sm">
              <button
                onClick={() => setMinimized(true)}
                className="cursor-pointer hover:brightness-90"
              >
                <img src={MinimizeImage} className="size-5 select-none" />
              </button>
              <button
                onClick={onMaximize}
                className="cursor-pointer hover:brightness-90"
              >
                <img src={MaximizeImage} className="size-5 select-none" />
              </button>
              <Link to="/closed" className="cursor-pointer hover:brightness-90">
                <img src={ExitImage} className="size-5 select-none" />
              </Link>
            </div>
          </div>
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
              <Link to="/" className="inline-flex items-center gap-1.5">
                <img src={BackImage} className="size-6"></img> Back
              </Link>
            </div>
            <div className="bg-gray-200 border-b px-1.5 border-gray-300 leading-snug flex items-center py-px gap-1">
              <div className="opacity-40 first-letter:underline">Address</div>
              <div className="bg-white border border-gray-400 flex-1 h-full px-1 flex items-center gap-0.5">
                <Link to="/" className="inline-flex items-center gap-1">
                  <img src={LocalDiskImage} className="size-4" />
                  <div className="text-sm tracking-widest">C:\</div>
                </Link>
                {path ? (
                  <Link to={`/${path}`} className="capitalize">
                    {path}
                  </Link>
                ) : null}
              </div>
            </div>
            <div className="flex flex-1">
              {/* Sidebar */}
              <div className="border-r-4 border-gray-200 h-full max-w-50 flex-1">
                <div className="bg-gray-200 px-2">Folders</div>

                <div className="flex flex-col items-start px-1">
                  <Link
                    to="/"
                    className="flex items-center gap-1 leading-tight"
                  >
                    <img src={MyComputerImage} className="size-4 select-none" />
                    My Computer
                  </Link>
                  <div className="flex flex-col items-start leading-tight ml-4">
                    <Link to="/about" className="flex items-center gap-1">
                      <img src={FolderImage} className="size-4 select-none" />
                      About
                    </Link>
                    <Link to="/projects" className="flex items-center gap-1">
                      <img src={FolderImage} className="size-4 select-none" />
                      Projects
                    </Link>
                    <Link to="/contact" className="flex items-center gap-1">
                      <img src={FolderImage} className="size-4 select-none" />
                      Contact
                    </Link>
                  </div>
                </div>
              </div>

              <div className="p-2 flex-1 h-full">
                <Outlet />
              </div>
            </div>
          </div>
        </div>
      </Resizable>
    </div>
  );
}
