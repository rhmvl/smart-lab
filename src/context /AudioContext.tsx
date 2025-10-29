import React, { createContext, useContext, useState, useRef, ReactNode } from 'react';

// Path ke file audio Anda di folder 'public/'
const BGM_SRC = '/background-music.mp3'; // Ganti dengan nama file musik Anda
const CLICK_SFX_SRC = '/click-sound.mp3'; // Ganti dengan nama file klik Anda

interface AudioContextType {
  isBgmOn: boolean;
  isSfxOn: boolean;
  toggleBgm: () => void;
  toggleSfx: () => void;
  playClickSound: () => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function AudioProvider({ children }: { children: ReactNode }) {
  const [isBgmOn, setIsBgmOn] = useState(false);
  const [isSfxOn, setIsSfxOn] = useState(true); // SFX biasanya nyala default

  const bgmRef = useRef<HTMLAudioElement | null>(null);
  const clickSfxRef = useRef<HTMLAudioElement | null>(null);

  // Inisialisasi audio player
  if (bgmRef.current === null) {
    bgmRef.current = new Audio(BGM_SRC);
    bgmRef.current.loop = true; // Musik akan berulang
    bgmRef.current.volume = 0.3; // Jangan terlalu keras
  }
  if (clickSfxRef.current === null) {
    clickSfxRef.current = new Audio(CLICK_SFX_SRC);
    clickSfxRef.current.volume = 0.5;
  }

  // Fungsi untuk BGM
  const toggleBgm = () => {
    setIsBgmOn(prev => {
      const isPlaying = !prev;
      if (isPlaying) {
        bgmRef.current?.play().catch(e => console.error("Gagal memutar BGM:", e));
      } else {
        bgmRef.current?.pause();
      }
      return isPlaying;
    });
  };

  // Fungsi untuk SFX
  const toggleSfx = () => {
    setIsSfxOn(prev => !prev);
  };

  // Fungsi untuk memutar suara klik
  const playClickSound = () => {
    if (isSfxOn && clickSfxRef.current) {
      clickSfxRef.current.currentTime = 0; // Putar ulang dari awal
      clickSfxRef.current.play().catch(e => console.error("Gagal memutar SFX klik:", e));
    }
  };

  const value = { isBgmOn, isSfxOn, toggleBgm, toggleSfx, playClickSound };

  return (
    <AudioContext.Provider value={value}>
      {children}
    </AudioContext.Provider>
  );
}

// Hook kustom untuk mempermudah penggunaan context
export function useAudio() {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error('useAudio harus digunakan di dalam AudioProvider');
  }
  return context;
}
