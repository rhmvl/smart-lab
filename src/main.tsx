import './index.css' // Global CSS
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'

// --- LOGIKA SPLASH SCREEN ---
const loadingTexts = [
  "Menyiapkan Smart Lab...",
"Apa? Ini adalah ruang eksplorasi sains.",
"Kenapa? Untuk membuat sains lebih interaktif.",
"Kegunaan: Mengukur, menghitung, dan memvisualisasikan data.",
"Memuat model AI dan visualisasi..."
];
let textIndex = 0;
const loadingTextElement = document.getElementById('loading-text');
const timerElement = document.getElementById('loading-timer');
let countdown = 5; // Waktu 5 detik

// 1. Interval Teks Acak (setiap 1.5 detik)
const textInterval = setInterval(() => {
  textIndex = (textIndex + 1) % loadingTexts.length;
  if (loadingTextElement) {
    loadingTextElement.style.opacity = '0';
setTimeout(() => {
  loadingTextElement.innerText = loadingTexts[textIndex];
  loadingTextElement.style.opacity = '1';
}, 400);
  }
}, 1500); // Ganti teks lebih cepat

// 2. Interval Hitungan Mundur (setiap 1 detik)
const countdownInterval = setInterval(() => {
  countdown--;
  if (timerElement) {
    timerElement.innerText = `${countdown}s`;
  }
  if (countdown <= 0) {
    clearInterval(countdownInterval); // Hentikan hitungan mundur
  }
}, 1000);

// Simpan ID interval agar bisa dihentikan oleh React
(window as any).splashTextInterval = textInterval;
(window as any).splashCountdownInterval = countdownInterval;
// --- AKHIR LOGIKA SPLASH SCREEN ---

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
  {/* <AudioProvider> */}
  <App />
  {/* </AudioProvider> */}
  </React.StrictMode>,
)
