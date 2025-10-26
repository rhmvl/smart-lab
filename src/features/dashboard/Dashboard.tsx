import { useState, useEffect, useCallback } from 'react';
import FeatureCard from './FeatureCard'; // Pastikan path ini benar
import './Dashboard.css'; // Import CSS kustom
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
// === PERBAIKI IMPORT INI ===
import { FiClock, FiSearch, FiSettings } from 'react-icons/fi'; // Pastikan FiSettings ada
import { type LucideIcon } from 'lucide-react'; // Impor LucideIcon (jika WEB_PAGE menggunakannya)
import { WEB_PAGE } from '../../utils/config';
import SettingsPanel from '../../components/common/SettingsPanel'; // Pastikan path ini benar

// Interface props DIUBAH: Tambahkan setNotesOpen
interface DashboardProps {
  onSelectFeature: (feature: string, icon: LucideIcon, color: string) => void;
  setNotesOpen: (isOpen: boolean) => void; // Tambahkan prop ini
}

// Daftar nama animasi masuk (digunakan oleh CSS)
const entryAnimations = [
  'slide-in-from-bottom-left',
  'slide-in-from-top',
  'slide-in-from-right',
];
// Acak animasi masuk
const shuffledAnimations = [...entryAnimations].sort(() => Math.random() - 0.5);

// Fungsi untuk menghasilkan posisi acak (Tetap sama)
const generatePositions = () => [
  { top: '30%', left: '20%' },
  { top: '55%', left: '40%' },
  { top: '30%', left: '60%' },
].sort(() => Math.random() - 0.5);

// Komponen Dashboard Utama
export default function Dashboard({ onSelectFeature, setNotesOpen }: DashboardProps){ // <-- TAMBAHKAN setNotesOpen DI SINI
  const [positions] = useState(generatePositions());
  const [init, setInit] = useState(false); // State untuk inisialisasi particles
  const [isSettingsOpen, setIsSettingsOpen] = useState(false); // <-- TAMBAHKAN STATE INI

  // 1. Inisialisasi engine tsparticles
  useEffect(() => {
    initParticlesEngine(async (engine: any) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  // 2. Efek Perspektif Mouse/Giroskop
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth: width, innerHeight: height } = window;
      const { clientX: x, clientY: y } = e;
      const tiltX = (y / height - 0.5) * -1; // Dibalik agar terasa alami
      const tiltY = (x / width - 0.5);
      // Target elemen dengan kelas spesifik
      document.querySelectorAll('.feature-card-interactive').forEach(card => {
        const htmlCard = card as HTMLElement;
        // Atur variabel CSS --rotateX dan --rotateY
        htmlCard.style.setProperty('--rotateX', `${tiltX * 15}deg`);
        htmlCard.style.setProperty('--rotateY', `${tiltY * 15}deg`);
      });
    };
    // Implementasi handleDeviceOrientation jika diperlukan (sama seperti sebelumnya)

    window.addEventListener('mousemove', handleMouseMove);
    // window.addEventListener('deviceorientation', handleDeviceOrientation);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      // window.removeEventListener('deviceorientation', handleDeviceOrientation);
    };
  }, []);

  // Opsi konfigurasi partikel (efek salju)
    const particlesOptions = {
      background: { color: { value: 'transparent' } },
      particles: {
          color: { value: "#ffffff" },
          move: { enable: true, speed: 1, direction: "bottom" },
          number: { value: 80 },
          opacity: { value: 0.5 },
          shape: { type: "circle" },
          size: { value: 3 },
      },
  };

  const particlesLoaded = useCallback(async (container: any) => {
    console.log("Particles loaded", container);
  }, []);

  // --- HANDLER BARU UNTUK IKON ---
  const handleSettingsClick = () => {
    setIsSettingsOpen(true); // Buka panel settings
  };

  const handleSearchNotesClick = () => {
    setNotesOpen(true); // Buka panel catatan (gunakan prop dari App.tsx)
  };

  if (!init) {
    return <div className="flex justify-center items-center min-h-screen">Memuat...</div>;
  }

  // JSX Return dengan Tailwind dan CSS kustom
  return (
    // Container utama dari repo teman Anda + 'relative' + 'overflow-hidden'
    <div className="flex flex-col items-center justify-center p-8 pt-24 min-h-screen relative overflow-hidden dashboard-outer-container"> {/* Tambah kelas kustom */}
        {/* Efek Partikel */}
        <Particles
          id="tsparticles"
          // @ts-ignore
          options={particlesOptions}
          particlesLoaded={particlesLoaded}
          className="absolute inset-0 z-0" // Pastikan ada di sini
        />

        {/* Header dengan Ikon (Gunakan style dari Dashboard.css) */}
        <header className="main-header">
            <h1 className="main-title">Smart Lab</h1> {/* Judul */}
            <div className="header-icons">
            {/* Tombol Settings */}
            <button onClick={handleSettingsClick} className="header-icon-btn" title="Pengaturan">
            <FiSettings size={18} /> {/* Ganti ikon */}
            </button>
            {/* Tombol Catatan */}
            <button onClick={handleSearchNotesClick} className="header-icon-btn" title="Catatan">
            <FiSearch size={18} />
            </button>
            </div>
        </header>

        {/* Container untuk kartu, diposisikan relatif di atas partikel */}
        {/* Kelas 'dashboard-container' dari CSS Anda digunakan di sini */}
        <div className="dashboard-container">
            {/* Mapping data dari WEB_PAGE */}
            {WEB_PAGE.map((feature, index) => (
                <FeatureCard
                    key={feature.id}
                    icon={feature.icon} // Kirim komponen LucideIcon
                    title={feature.title}
                    description={feature.description} // Deskripsi tetap ada
                    color={feature.color}
                    onClick={() => onSelectFeature(feature.id, feature.icon, feature.color)} // Kirim ID, Ikon Lucide, Warna
                    // Terapkan style posisi dan animasi
                    style={{
                      ...positions[index], // Posisi acak
                      // Hapus baris ini:
                      // animationName: `${shuffledAnimations[index]}, zero-gravity`,
                      // Terapkan HANYA delay dan variabel perspektif
                      animationDelay: `${feature.delay || '0s'}, 1s`,
                      '--rotateX': '0deg', // Inisialisasi variabel CSS
                      '--rotateY': '0deg'  // Inisialisasi variabel CSS
                    }}
                    // Tambahkan kelas untuk target perspektif JS & animasi
                    className="feature-card-interactive" // Kelas kustom untuk target JS/CSS
                />
            ))}
        </div>
        {/* Panel Settings (muncul kondisional) */}
        <SettingsPanel isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </div>
  );
}
