import { useState } from "react";

import { WindowShell } from "../../ WindowShell";
import { useAppContext } from "../../context";

interface Props {
  id: number;
}

export function NotepadWindow(props: Props) {
  const { id } = props;

  const { windows, setWindowTitle } = useAppContext();

  const windowState = windows[id];

  if (!windowState) throw Error("Window not found");

  const [showTools, setShowTools] = useState(false);

  // useEffect(() => {
  //   setWindowTitle(id, path ? `C:\\ ${path}` : "My Computer");
  // }, [path, id, setWindowTitle]);

  return (
    <WindowShell id={id}>
      <div className="bg-white flex flex-col flex-1 border-4 border-t-0 border-blue-700">
        <div className="flex items-center px-2 bg-gray-200 border-b border-gray-300">
          <div className="relative">
            <div
              onClick={() => setShowTools(!showTools)}
              className={`first-letter:underline px-2 cursor-pointer ${
                showTools ? "text-white bg-blue-800" : ""
              }`}
            >
              File
            </div>
            {showTools && (
              <div className="absolute top-full divide-y min-w-40 divide-gray-300 border border-gray-300 left-0 bg-white">
                {["New", "Open...", "Save", "Save As...", "Print", "Exit"].map(
                  (tool) => (
                    <div
                      key={tool}
                      className="px-4  hover:bg-blue-800 hover:text-white"
                    >
                      {tool}
                    </div>
                  )
                )}
              </div>
            )}
          </div>
          <div className="first-letter:underline px-2 opacity-40">Edit</div>
          <div className="first-letter:underline px-2 opacity-40">Format</div>
          <div className="first-letter:underline px-2 opacity-40">View</div>
          <div className="first-letter:underline px-2 opacity-40">Help</div>
        </div>

        <div className="flex-1 h-full">
          <textarea
            autoFocus
            className="w-full h-full px-1 py-px focus-visible:outline-none font-mono text-xs"
          />
        </div>
      </div>
    </WindowShell>
  );
}
