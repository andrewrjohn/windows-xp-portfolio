import FolderImage from "../../../assets/icons/folder.png";
import { FileGrid } from "../../../components/FileGrid";
import { FileExplorerPath } from "../../../context";

interface Props {
  setPath: (path: FileExplorerPath) => void;
}

export function HomePage(props: Props) {
  const { setPath } = props;

  return (
    <FileGrid>
      <Folder name="About" path="about" setPath={setPath} />
      <Folder name="Projects" path="projects" setPath={setPath} />
      <Folder name="Contact" path="contact" setPath={setPath} />
    </FileGrid>
  );
}

function Folder({
  name,
  path,
  setPath,
  image = FolderImage,
}: {
  name: string;
  path: FileExplorerPath;
  setPath: (path: FileExplorerPath) => void;
  image?: string;
}) {
  return (
    <button
      onClick={() => setPath(path)}
      className="inline-flex items-center gap-2 cursor-pointer"
    >
      <img src={image} className="size-12" />
      <div>{name}</div>
    </button>
  );
}
