import { Link } from "react-router";
import FolderImage from "../assets/icons/folder.png";
import { ExplorerGrid } from "../ExplorerGrid";
// import EmailImage from "../assets/icons/email.png";

export function HomePage() {
  return (
    <ExplorerGrid>
      <Folder name="About" path="/about" />
      <Folder name="Projects" path="/projects" />
      {/* <Folder name="Email" path="/contact" image={EmailImage} /> */}
      <Folder name="Contact" path="/contact" />
    </ExplorerGrid>
  );
}

function Folder({
  name,
  path,
  image = FolderImage,
}: {
  name: string;
  path: string;
  image?: string;
}) {
  return (
    <Link to={path} className="inline-flex items-center gap-2">
      <img src={image} className="size-12" />
      <div>{name}</div>
    </Link>
  );
}
