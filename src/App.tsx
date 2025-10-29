import { useState, useCallback, useRef, useEffect } from 'react';
import Dashboard from './features/dashboard/Dashboard';
import CalcForge from './features/calc-forge/CalcForge';
import ArLab from './features/ar-lab/ArLab';
import AlgoWorks from './features/algo-works/AlgoWorks';
import Notes from './features/notes/Notes';
import Navbar from './components/layout/Navbar';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { FeatureView } from './components/layout/FeatureView';
import { TransitionOverlay } from './components/layout/TransitionOverlay';
import { WEBSITE_URL } from './utils/config';
import { FlaskConicalIcon, type LucideIcon } from 'lucide-react';
import './App.css'; // Pastikan CSS diimpor
import Particles, { initParticlesEngine } from "@tsparticles/react"; // Impor Particles
import { loadSlim } from "@tsparticles/slim"; // Impor varian slim
import { AudioProvider } from './context/AudioContext'; // <-- Impor Provider

// Main Router-enabled App Component
const AppContent = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Panggil hook
  const [isNotesOpen, setNotesOpen] = useState(false);
  const [isTransitioning, setTransitioning] = useState(false);
  const [transitionIcon, setTransitionIcon] = useState<LucideIcon>(FlaskConicalIcon); // Sesuaikan jika Anda beralih ke URL string
  const iconColor = useRef("white");

  // Tentukan apakah navbar visible (logika sama seperti di Navbar.tsx)
  const isNavbarVisible = location.pathname !== WEBSITE_URL;

  const handleFeatureSelect = useCallback((featurePath: string, icon: LucideIcon, color: string) => {
    setTransitionIcon(icon);
    iconColor.current = color;
    setTransitioning(true);

    setTimeout(() => {
      navigate(WEBSITE_URL + '/' + featurePath);
      setTransitioning(false);
    }, 900);
  }, [navigate]);

  // Pastikan ini tidak dikomentari
  const handleBackToDashboard = () => {
    if (!isTransitioning) {
      setTransitionIcon(FlaskConicalIcon); // Gunakan ikon default
      setTransitioning(true);
      setTimeout(() => {
        navigate(WEBSITE_URL); // Kembali ke dashboard
        setTransitioning(false);
      }, 700);
    }
  };

  // 1. Inisialisasi engine tsparticles (dijalankan sekali)
  useEffect(() => {
    initParticlesEngine(async (engine: any) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  // 2. Opsi untuk EFEK HUJAN (Lebih banyak, kecil, cepat)
  const particlesOptions = {
    background: { color: { value: "transparent" } }, // Transparan agar gradien body terlihat
    fpsLimit: 60,
    particles: {
      number: {
        value: 250, // Lebih banyak partikel
        density: { enable: true, value_area: 800 }
      },
      color: { value: "#ffffff" },
      shape: { type: "circle" },
      opacity: { value: 0.4, random: true }, // Sedikit lebih redup
      size: {
        value: 1.5, // Lebih kecil
        random: true
      },
      links: { enable: false },
      move: {
        enable: true,
        speed: 6, // Lebih cepat (seperti hujan)
        direction: "bottom", // Arah Hujan
        random: false,
        straight: true, // Lurus ke bawah
        outModes: "out",
      },
    },
    interactivity: { events: {}, modes: {} },
    detectRetina: true,
  };

  const particlesLoaded = useCallback((container: any) => {
    console.log("Particles loaded:", container);
  }, []);
  // === AKHIR LOGIKA PARTIKEL ===
  // === LOGIKA SEMBUNYIKAN SPLASH SCREEN (HANYA SATU KALI) ===
  // === LOGIKA SEMBUNYIKAN SPLASH SCREEN ===
  useEffect(() => {
    const splashTimer = setTimeout(() => {
      const splashScreen = document.getElementById('splash-screen');
      const textInterval = (window as any).splashTextInterval;
      const countdownInterval = (window as any).splashCountdownInterval;

      // Sembunyikan splash screen dengan animasi
      if (splashScreen) {
        splashScreen.classList.add('hidden');
      }

      // Hentikan interval ganti teks & hitungan mundur
      if (textInterval) clearInterval(textInterval);
      if (countdownInterval) clearInterval(countdownInterval);

      // Hapus splash screen dari DOM setelah animasi fade-out selesai
      setTimeout(() => {
        splashScreen?.remove();
      }, 500); // 0.5s (sesuai durasi transisi CSS)

    }, 5000); // 5000ms = 5 detik

    // Cleanup timer
    return () => clearTimeout(splashTimer);
  }, []); // [] = Jalankan hanya sekali
  // =========================================================

  return (
    <div className="relative w-full min-h-screen overflow-hidden">

    {/* Partikel Hujan (Render di semua halaman) */}
    {init && ( // Hanya render jika engine siap
      <Particles
      id="tsparticles"
      // @ts-expect-error
      options={particlesOptions}
      particlesLoaded={particlesLoaded}
      className="absolute inset-0 z-0" // z-0 (paling belakang)
    />
    )}

    {/* Konten Aplikasi (z-10 ke atas) */}
    <{/* Konten Aplikasi (z-10 ke atas) */}
    <div className={isNavbarVisible ? "pt-16 relative z-10" : "relative z-10"}> {/* Pastikan konten di atas partikel */}
    <Navbar setNotesOpen={setNotesOpen} />
    <Routes>
    <Route path={WEBSITE_URL} element={<Dashboard onSelectFeature={handleFeatureSelect} setNotesOpen={setNotesOpen} />} />
    <Route path={`${WEBSITE_URL}/algo-works/*`} element={<AlgoWorks />} />
    <Route path={`${WEBSITE_URL}/calc-forge`} element={<CalcForge />} />
    <Route path={`${WEBSITE_URL}/ar-lab/*`} element={<ArLab />} />
    <Route path="*" element={<FeatureView title="404" description="Halaman tidak ditemukan." bgColor="bg-red-700" />} />
    </Routes>
    </div>

    {/* Panel Catatan (Modal) */}
    <Notes isOpen={isNotesOpen} onClose={() => setNotesOpen(false)} />

    {/* Lapisan Animasi Transisi */}
    <TransitionOverlay isTransitioning={isTransitioning} icon={transitionIcon} color={iconColor.current} />

    {/* Tombol kembali (Gunakan 'location.pathname' dari hook) */}
    {location.pathname !== WEBSITE_URL && !isTransitioning && (
      <button onClick={handleBackToDashboard} className="app-button back-btn" style={{zIndex: 1001}}>
      Kembali
      </button>
    )}
    </div>
  );
};
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
  <AudioProvider> {/* <-- Bungkus App Anda */}
  <App />
  </AudioProvider>
  </React.StrictMode>,
);
// Komponen App utama dengan BrowserRouter (Sudah benar)
const App: React.FC = () => (
  <BrowserRouter>
  <AppContent />
  </BrowserRouter>
);

export default App;
