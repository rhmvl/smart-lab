import { useContext } from "react";
import { AudioContext } from "../context/AudioContext";

export function useAudio() {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error('useAudio harus digunakan di dalam AudioProvider');
  }
  return context;
}
