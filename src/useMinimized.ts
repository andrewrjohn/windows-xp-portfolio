import { atom, useAtom } from "jotai";

const minimizedAtom = atom(false);

export function useMinimized() {
  return useAtom(minimizedAtom);
}
