import { WindowShell } from "../../components/WindowShell";
import { useAppContext } from "../../context";
import { Menu } from "../../components/Menu";
import { useHotkey } from "../../hooks/useHotkey";
import { ComponentProps, useEffect, useRef, useState } from "react";

interface Props {
  id: number;
}

export function NotepadApplication(props: Props) {
  const { id } = props;

  const { windows, closeWindow, addWindow, setActiveWindow, updateWindow } =
    useAppContext();

  const windowState = windows[id];

  if (!windowState || windowState.application !== "notepad")
    throw Error("Missing or invalid window application type not found");

  const { defaultText } = windowState;

  const [selectedText, setSelectedText] = useState("");
  const [text, setText] = useState(defaultText || "");
  const [isUnsaved, setIsUnsaved] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const newWindow = () => {
    const id = addWindow({ application: "notepad" });

    setActiveWindow(id);
  };

  const copy = () => {
    if (!selectedText) return;

    window.navigator.clipboard.writeText(selectedText);
  };

  const _getBeforeCursor = () => {
    return (
      textareaRef.current?.value.slice(
        0,
        textareaRef.current?.selectionStart
      ) || ""
    );
  };

  const _getAfterCursor = () => {
    return (
      textareaRef.current?.value.slice(textareaRef.current?.selectionEnd) || ""
    );
  };

  const paste = () => {
    window.navigator.clipboard.readText().then((text) => {
      const beforeCursor = _getBeforeCursor();
      const afterCursor = _getAfterCursor();

      setText(beforeCursor + text + afterCursor);
    });
  };

  const deleteText = () => {
    const beforeCursor = _getBeforeCursor();
    const afterCursor = _getAfterCursor();

    setText(beforeCursor + afterCursor);
  };

  const cut = () => {
    copy();
    deleteText();
  };

  const openFile = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "text/*";

    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];

      if (!file) return;

      const reader = new FileReader();

      reader.onload = (e) => {
        const text = e.target?.result as string;

        addWindow({
          application: "notepad",
          defaultText: text,
          title: file.name,
        });
      };

      reader.readAsText(file);
    };

    input.click();
  };

  const fileMenuItems: ComponentProps<typeof Menu>["items"] = [
    {
      label: "New",
      shortcut: "Ctrl+N",
      onClick: newWindow,
    },
    {
      label: "Open...",
      shortcut: "Ctrl+O",
      onClick: openFile,
    },
    {
      label: "Save",
      shortcut: "Ctrl+S",
      onClick: () => {},
      disabled: true,
    },
    { label: "Save As...", onClick: () => {}, disabled: true },
    {
      label: "Print",
      shortcut: "Ctrl+P",
      onClick: () => print(),
    },
    { label: "Exit", onClick: () => closeWindow(id) },
  ];

  const editMenuItems: ComponentProps<typeof Menu>["items"] = [
    { label: "Undo", shortcut: "Ctrl+Z", disabled: true },
    { label: "Redo", shortcut: "Ctrl+Y", disabled: true },
    { label: "Cut", shortcut: "Ctrl+X", onClick: cut },
    {
      label: "Copy",
      shortcut: "Ctrl+C",
      onClick: copy,
    },
    {
      label: "Paste",
      shortcut: "Ctrl+V",
      onClick: paste,
    },
    { label: "Delete", shortcut: "Del", onClick: deleteText },
  ];

  useHotkey("Ctrl+O", openFile);
  useHotkey("Ctrl+N", newWindow);
  useHotkey("Ctrl+P", print);
  useHotkey("Ctrl+C", copy);
  useHotkey("Ctrl+V", paste);
  useHotkey("Del", deleteText);
  useHotkey("Ctrl+X", cut);

  useEffect(() => {
    if (isUnsaved) return;

    if (text !== defaultText) {
      setIsUnsaved(true);

      updateWindow(id, { title: (title) => `${title} *` });
    }
  }, [text]);

  return (
    <WindowShell id={id}>
      <div className="bg-white flex flex-col flex-1 border-4 border-t-0 border-blue-700">
        <div className="flex items-center bg-yellow-50 border-b leading-tight border-gray-300">
          <Menu
            trigger={(props) => <button {...props}>File</button>}
            items={fileMenuItems}
          />
          <Menu
            trigger={(props) => <button {...props}>Edit</button>}
            items={editMenuItems}
          />

          <div className="first-letter:underline px-2 opacity-40">Format</div>
          <div className="first-letter:underline px-2 opacity-40">View</div>
          <div className="first-letter:underline px-2 opacity-40">Help</div>
        </div>

        <div className="flex-1 h-full">
          <textarea
            ref={textareaRef}
            autoFocus
            value={text}
            onChange={(e) => setText(e.target.value)}
            onSelect={() =>
              setSelectedText(window.getSelection()?.toString() || "")
            }
            className="w-full h-full print:bg-white print:fixed print:inset-0 print:z-20 print:cursor-none px-1 py-px focus-visible:outline-none font-notepad text-sm"
          />
        </div>
      </div>
    </WindowShell>
  );
}
