import { Window } from "../context";
import { FileExplorerApplication } from "../applications/FileExplorer/FileExplorerApplication";
import { NotepadApplication } from "../applications/Notepad/NotepadApplication";

interface Props {
  id: number;
  windowState: Window;
}

export function DynamicWindow(props: Props) {
  const { id, windowState } = props;

  switch (windowState.application) {
    case "file_explorer":
      return <FileExplorerApplication id={id} />;
    case "notepad":
      return <NotepadApplication id={id} />;
    default:
      return (
        <div>
          Unknown application type (did you forget to add it to DynamicWindow?)
        </div>
      );
  }
}
