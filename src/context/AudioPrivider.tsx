import { useState, useRef, type ReactNode } from 'react';
import { AudioContext, type AudioContextType } from './AudioContext';

const BGM_SRC = '/background-music.mp3';
const CLICK_SFX_SRC = '/click-sound.mp3';

export function AudioProvider({ children }: { children: ReactNode }) {
  const [isBgmOn, setIsBgmOn] = useState(false);
  const [isSfxOn, setIsSfxOn] = useState(true);

  const bgmRef = useRef<HTMLAudioElement | null>(null);
  const clickSfxRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio only once
  if (bgmRef.current === null) {
    bgmRef.current = new Audio(BGM_SRC);
    bgmRef.current.loop = true;
    bgmRef.current.volume = 0.3;
  }
  if (clickSfxRef.current === null) {
    clickSfxRef.current = new Audio(CLICK_SFX_SRC);
    clickSfxRef.current.volume = 0.5;
  }

  const toggleBgm = () => {
    setIsBgmOn((prev) => {
      const newState = !prev;
      if (newState) {
        bgmRef.current
          ?.play()
          .catch((e) => console.error('Gagal memutar BGM:', e));
      } else {
        bgmRef.current?.pause();
      }
      return newState;
    });
  };

  const toggleSfx = () => {
    setIsSfxOn((prev) => !prev);
  };

  const playClickSound = () => {
    if (isSfxOn && clickSfxRef.current) {
      clickSfxRef.current.currentTime = 0;
      clickSfxRef.current
        .play()
        .catch((e) => console.error('Gagal memutar SFX klik:', e));
    }
  };

  const value: AudioContextType = {
    isBgmOn,
    isSfxOn,
    toggleBgm,
    toggleSfx,
    playClickSound,
  };

  return (
    <AudioContext.Provider value={value}>
      {children}
    </AudioContext.Provider>
  );
}

