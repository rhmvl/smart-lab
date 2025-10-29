import { createContext } from "react";

export interface AudioContextType {
  isBgmOn: boolean;
  isSfxOn: boolean;
  toggleBgm: () => void;
  toggleSfx: () => void;
  playClickSound: () => void;
}

export const AudioContext = createContext<AudioContextType | undefined>(undefined);
