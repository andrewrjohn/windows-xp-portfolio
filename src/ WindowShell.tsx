import { DndContext, useDraggable } from "@dnd-kit/core";
import { Resizable } from "re-resizable";
import { useMemo, useState } from "react";
import ExitImage from "./assets/icons/exit.png";
import MaximizeImage from "./assets/icons/maximize.png";
import MinimizeImage from "./assets/icons/minimize.png";
import { useAppContext, type Window } from "./context";

interface Props {
  id: number;
  children: React.ReactNode;
}

export function WindowShell(props: Props) {
  const { id, children } = props;

  const { windows, setWindowFullScreen, setActiveWindow } = useAppContext();

  const windowState = windows[id];

  if (!windowState) throw new Error("Window not found");

  const [coords, setCoords] = useState<{ left: number; top: number }>({
    left: 100,
    top: 100,
  });

  return (
    <DndContext
      autoScroll={false}
      onDragStart={() => {
        setActiveWindow(id);
      }}
      onDragEnd={(e) => {
        setWindowFullScreen(id, false);

        setCoords((prev) => ({
          left: prev.left + e.delta.x,
          top: prev.top + e.delta.y,
        }));
      }}
    >
      <ExplorerWindow
        {...coords}
        setCoords={setCoords}
        windowState={windowState}
      >
        {children}
      </ExplorerWindow>
    </DndContext>
  );
}

function ExplorerWindow({
  top,
  left,
  setCoords,
  windowState,
  children,
}: {
  top: number;
  left: number;
  setCoords: (coords: { top: number; left: number }) => void;
  windowState: Window;
  children: React.ReactNode;
}) {
  const {
    setWindowFullScreen,
    closeWindow,
    setWindowMinimized,
    setActiveWindow,
    activeWindow,
  } = useAppContext();

  const [size, setSize] = useState({ height: "480px", width: "680px" });
  const [lastSize, setLastSize] = useState({ height: "480px", width: "680px" });
  const [lastCoords, setLastCoords] = useState({ top: 0, left: 0 });

  const { attributes, listeners, setNodeRef, transform, active } = useDraggable(
    {
      id: "draggable",
    }
  );

  const style = useMemo(() => {
    const baseStyle = {
      transition: !active ? "all 0.150s ease-in-out" : undefined,
      transform: windowState.minimized
        ? "translate3d(calc(-100vw + 61vw), calc(100vh - 50px), 0) scale(0)"
        : transform
        ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
        : undefined,
    };

    return baseStyle;
  }, [transform, windowState.minimized, active]);

  const onMaximize = () => {
    if (windowState.fullScreen) {
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

    setWindowFullScreen(windowState.id, !windowState.fullScreen);
  };

  return (
    <div
      ref={setNodeRef}
      onClick={() => setActiveWindow(windowState.id)}
      className={`absolute ${
        active ? "" : "transition-transform duration-150"
      } ${activeWindow === windowState.id ? "z-20" : "z-10"}`}
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
          <div
            className={`h-8 flex items-center justify-between via-blue-700 px-1.5 text-white to-blue-500 bg-gradient-to-b from-blue-500 rounded-t-lg ${
              activeWindow !== windowState.id ? "brightness-125" : ""
            }`}
          >
            <div {...listeners} className="flex items-center flex-1">
              <div className="text-lg capitalize">
                {windowState.title}
                {/* {path ? (
                  <span className="capitalize">{path}</span>
                ) : (
                  "Local Disk (C:)"
                )} */}
              </div>
            </div>
            <div className="flex items-center gap-0.5 text-sm">
              <button
                onClick={() => setWindowMinimized(windowState.id, true)}
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
              <button
                onClick={() => closeWindow(windowState.id)}
                className="cursor-pointer hover:brightness-90"
              >
                <img src={ExitImage} className="size-5 select-none" />
              </button>
            </div>
          </div>
          {children}
        </div>
      </Resizable>
    </div>
  );
}
