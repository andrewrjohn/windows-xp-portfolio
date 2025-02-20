import { FileGrid } from "../../../components/FileGrid";
import TxtImage from "../../../assets/icons/txt.png";
import { useAppContext } from "../../../context";
import { useState } from "react";

export function RecycleBin() {
  const { addWindow, setActiveWindow } = useAppContext();

  const openFile = () => {
    const id = addWindow({
      application: "notepad",
      title: "trash.txt",
      defaultText: "Stop looking through my trash!",
    });

    setActiveWindow(id);
  };

  return (
    <FileGrid>
      <File name="trash.txt" onClick={openFile} />
    </FileGrid>
  );
}

function File({
  name,
  image = TxtImage,
  onClick,
}: {
  name: string;
  onClick: () => void;
  image?: string;
}) {
  const [selected, setSelected] = useState(false);

  return (
    <button
      onClick={() => setSelected(!selected)}
      onDoubleClick={() => {
        setSelected(true);
        onClick();
      }}
      className={`inline-flex items-center p-1 gap-2 cursor-pointer ${
        selected ? "outline outline-dashed" : ""
      }`}
    >
      <img src={image} className="size-10" />
      <div>{name}</div>
    </button>
  );
}
