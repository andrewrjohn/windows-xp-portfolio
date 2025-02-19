import { Window } from "./context";
import { FileExplorerWindow } from "./applications/FileExplorer/FileExplorerWindow";
import { NotepadWindow } from "./applications/Notepad/NotepadWindow";

interface Props {
  id: number;
  windowState: Window;
}

export function DynamicWindow(props: Props) {
  const { id, windowState } = props;

  switch (windowState.application) {
    case "file_explorer":
      return <FileExplorerWindow id={id} />;
    case "notepad":
      return <NotepadWindow id={id} />;
    default:
      return <div>Unknown window type: {windowState.application}</div>;
  }
}
