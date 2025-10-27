import { useState, useEffect, useCallback, useMemo } from 'react';
import FeatureCard from './FeatureCard'; // Pastikan path ini benar
import './Dashboard.css'; // Import CSS kustom
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { FiClock, FiSearch, FiSettings } from 'react-icons/fi'; // Pastikan FiSettings ada
import { type LucideIcon } from 'lucide-react'; // Impor LucideIcon (jika WEB_PAGE menggunakannya)
import { WEB_PAGE } from '../../utils/config';
import SettingsPanel from '../../components/common/SettingsPanel'; // Pastikan path ini benar

// Interface props DIUBAH: Tambahkan setNotesOpen
interface DashboardProps {
  onSelectFeature: (feature: string, icon: LucideIcon, color: string) => void;
  setNotesOpen: (isOpen: boolean) => void; // Tambahkan prop ini
}

// Daftar nama animasi masuk (digunakan oleh CSS keyframes)
const entryAnimations = [
  'slide-in-from-bottom-left',
'slide-in-from-top',
'slide-in-from-right',
];

// Daftar kelas animasi acak (nama kelas CSS yang menerapkan keyframes)
const animationClasses = [
  'animate-spin-card',
'animate-breathe',
'animate-zero-gravity',
'animate-side-to-side',
'animate-up-and-down',
'animate-flicker',
'animate-pendulum',
];

// Fungsi untuk mendapatkan 3 animasi acak yang berbeda
const getRandomAnimations = () => {
  // Acak array kelas animasi
  const shuffled = [...animationClasses].sort(() => 0.5 - Math.random());
  // Ambil 3 kelas pertama dari hasil acak
  return shuffled.slice(0, 3);
};

// Fungsi untuk menghasilkan posisi acak (Tetap sama)
const generatePositions = () => [
  // Kartu 1: Lebih ke atas
  { top: '20%', left: '15%' }, // <-- Ubah dari 25%
// Kartu 2: Lebih ke atas
{ top: '40%', left: '40%' }, // <-- Ubah dari 45%
// Kartu 3: Lebih ke atas
{ top: '20%', left: '65%' }, // <-- Ubah dari 25%
].sort(() => Math.random() - 0.5); // Acak array posisi


// Komponen Dashboard Utama
// === PERBAIKI: Terima setNotesOpen ===
export default function Dashboard({ onSelectFeature, setNotesOpen }: DashboardProps){
  const [positions] = useState(generatePositions());
  const [init, setInit] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [cardAnimations, setCardAnimations] = useState<string[]>(getRandomAnimations());

  // 1. useEffect untuk inisialisasi engine tsparticles
  useEffect(() => {
    initParticlesEngine(async (engine: any) => {
      await loadSlim(engine); // Muat varian slim
    }).then(() => {
      setInit(true); // Tandai inisialisasi selesai
    });
  }, []); // Hanya dijalankan sekali saat mount

  // 2. useEffect untuk mengubah animasi secara berkala
  useEffect(() => {
    // Fungsi untuk mendapatkan interval acak (5-7 detik)
    const getRandomInterval = () => Math.random() * 2000 + 5000;

    let intervalId: NodeJS.Timeout | undefined; // Simpan ID interval

    // Fungsi untuk mengatur interval berikutnya
    const scheduleNextAnimationChange = () => {
      intervalId = setTimeout(() => {
        setCardAnimations(getRandomAnimations()); // Ubah animasi
        scheduleNextAnimationChange(); // Jadwalkan perubahan berikutnya
      }, getRandomInterval());
    };

    // Mulai penjadwalan pertama
    scheduleNextAnimationChange();

    // Bersihkan interval saat komponen unmount
    return () => {
      if (intervalId) {
        clearTimeout(intervalId);
      }
    };
  }, []); // Hanya dijalankan sekali saat mount

  // 3. useEffect untuk Efek Perspektif Mouse/Giroskop
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

    // Implementasi handleDeviceOrientation jika diperlukan
    const handleDeviceOrientation = (e: DeviceOrientationEvent) => {
      const { beta, gamma } = e;
      if (beta === null || gamma === null) return;
      const tiltX = (beta / 90);
      const tiltY = (gamma / 90);
      document.querySelectorAll('.feature-card-interactive').forEach(card => {
        const htmlCard = card as HTMLElement;
        htmlCard.style.setProperty('--rotateX', `${tiltX * 15}deg`);
        htmlCard.style.setProperty('--rotateY', `${tiltY * 15}deg`);
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('deviceorientation', handleDeviceOrientation); // Aktifkan jika perlu
    // Fungsi cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('deviceorientation', handleDeviceOrientation);
    };
  }, []); // Hanya dijalankan sekali

  // Opsi konfigurasi partikel (Pastikan struktur benar)
  const particlesOptions = {
    background: { color: { value: 'transparent' } },
    fpsLimit: 60, // Perbaiki jika perlu
    particles: {
      number: { value: 80, density: { enable: true, value_area: 800 } }, // density opsional
      color: { value: "#ffffff" },
      shape: { type: "circle" },
      opacity: { value: 0.5, random: true }, // random opsional
      size: { value: 3, random: true }, // random opsional
      line_linked: { enable: false },
      move: { enable: true, speed: 1, direction: "bottom", random: false, straight: false, out_mode: "out", bounce: false }
    }, // <-- Pastikan kurung kurawal ini ada
    interactivity: { enable: false },
    detectRetina: true,
  };
  const particlesLoaded = useCallback(async (container: any) => {
    console.log("Particles loaded", container);
    // Anda bisa melakukan sesuatu saat partikel siap jika perlu
  }, []);

  // Handlers ikon header
  const handleSettingsClick = () => { setIsSettingsOpen(true); };
  const handleSearchNotesClick = () => { setNotesOpen(true); };

  // Tampilkan loading jika engine partikel belum siap
  if (!init) {
    return <div className="flex justify-center items-center min-h-screen text-white bg-gray-900">Memuat Efek Visual...</div>; // Tampilan loading
  }

  // JSX Return
  return (
    <div className="flex flex-col items-center justify-center p-8 pt-24 min-h-screen relative overflow-hidden dashboard-outer-container">
    <Particles
    id="tsparticles"
    // @ts-ignore
    options={particlesOptions} // Pastikan variabel 'particlesOptions' sudah didefinisikan di atas
    particlesLoaded={particlesLoaded} // <-- Prop yang benar
    className="absolute inset-0 z-0" // Posisi di belakang
    />

    {/* Komponen Header */}
    <header className="main-header">
    <h1 className="main-title">Smart Lab</h1>
    <div className="header-icons">
    <button onClick={handleSettingsClick} className="header-icon-btn" title="Pengaturan">
    <FiSettings size={18} />
    </button>
    <button onClick={handleSearchNotesClick} className="header-icon-btn" title="Catatan">
    <FiSearch size={18} />
    </button>
    </div>
    </header>

    <div className="dashboard-container">
    {WEB_PAGE.map((feature, index) => (
      <FeatureCard
      key={feature.id}
      icon={feature.icon}
      title={feature.title}
      description={feature.description}
      color={feature.color}
      onClick={() => onSelectFeature(feature.id, feature.icon, feature.color)}
      style={{
        ...positions[index],
        // Hanya delay & variabel CSS
        animationDelay: `${feature.delay || '0s'}`, // Hanya delay masuk
        '--rotateX': '0deg',
        '--rotateY': '0deg'
      }}
      // Teruskan kelas animasi acak
      animationClass={cardAnimations[index % cardAnimations.length]}
      />
    ))}
    </div>
    <SettingsPanel isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </div>
  );
}
