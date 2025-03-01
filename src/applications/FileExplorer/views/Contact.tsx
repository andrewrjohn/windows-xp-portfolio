import NetworkImage from "../../../assets/icons/network.png";
import EmailImage from "../../../assets/icons/email.png";
import { FileGrid } from "../../../components/FileGrid";

export function ContactPage() {
  return (
    <FileGrid>
      <Item name="Email" href="mailto:andrewj@hey.com" image={EmailImage} />
      <Item name="GitHub" href="https://github.com/andrewrjohn" />
      <Item
        name="LinkedIn"
        href="https://www.linkedin.com/in/andrew-johnson-21031378/"
      />
    </FileGrid>
  );
}

function Item({
  name,
  href,
  image = NetworkImage,
}: {
  name: string;
  href: string;
  image?: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-2"
    >
      <img src={image} className="size-10" />
      <div>{name}</div>
    </a>
  );
}
