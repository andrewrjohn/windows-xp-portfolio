import { JSX, useEffect, useRef, useState } from "react";

interface Props {
  trigger: (
    props: React.DetailedHTMLProps<
      React.ButtonHTMLAttributes<HTMLButtonElement>,
      HTMLButtonElement
    >
  ) => JSX.Element;
  items: {
    label: string;
    shortcut?: string;
    onClick?: () => void;
    disabled?: boolean;
  }[];
}

export function Menu(props: Props) {
  const { items } = props;

  const menuRef = useRef<HTMLDivElement>(null);

  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const Trigger = props.trigger;

  return (
    <div className="relative" ref={menuRef}>
      <Trigger
        onClick={() => {
          setOpen(!open);
        }}
        className={`first-letter:underline px-2 cursor-pointer ${
          open ? "text-white bg-blue-800" : ""
        }`}
      />
      {open && (
        <div className="absolute shadow-[2px_2px_3px_rgba(0,0,0,0.65)] top-full min-w-40 border border-gray-300 left-0 bg-white">
          {items.map((item) => (
            <button
              key={item.label}
              className="px-4 w-full disabled:opacity-50 not-disabled:hover:bg-blue-800 not-disabled:hover:text-white last-of-type:border-t border-gray-300 flex items-center justify-between"
              onClick={() => {
                setOpen(false);
                item.onClick?.();
              }}
              disabled={item.disabled}
            >
              {item.label}
              {item.shortcut && (
                <span className="opacity-59">{item.shortcut}</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
