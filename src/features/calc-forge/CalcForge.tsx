// src/features/calc-forge/CalcForge.tsx
import React from 'react';
import useWindowSize from '../../hooks/useWindowSize'; // Impor hook ukuran layar
import CalcForgeDesktop from './CalcForgeDesktop';     // Impor versi Desktop
import CalcForgeMobile from './CalcForgeMobile';       // Impor versi Mobile
import './calculatorLogic';
// Tentukan breakpoint lebar layar (misal: 768px)
const MOBILE_BREAKPOINT = 768;

export default function CalcForge() {
  // Dapatkan lebar layar saat ini
  const { width } = useWindowSize();

  // Tampilkan loading atau null jika lebar belum terdeteksi
  if (width === undefined) {
    return <div className="flex justify-center items-center min-h-screen">Memuat Kalkulator...</div>; // Atau null
  }

  // Pilih komponen yang akan dirender berdasarkan lebar layar
  if (width < MOBILE_BREAKPOINT) {
    // Jika layar kecil (mobile), tampilkan CalcForgeMobile
    return <CalcForgeMobile />;
  } else {
    // Jika layar besar (desktop/tablet), tampilkan CalcForgeDesktop (yang punya 2 kolom)
    return <CalcForgeDesktop />;
  }
}
