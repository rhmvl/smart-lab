import React, { useState, useEffect } from 'react';
import './SettingsPanel.css'; // Buat file CSS untuk styling

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsPanel({ isOpen, onClose }: SettingsPanelProps) {
  // Ambil tema tersimpan atau default ke 'light'
  const [theme, setTheme] = useState(localStorage.getItem('smartlab-theme') || 'light');

  // Terapkan tema ke elemen <html> saat state berubah
    useEffect(() => {
      const root = window.document.documentElement; // Target <html>
      root.classList.remove('light', 'dark'); // Hapus kelas lama
      if (theme === 'dark') {
        root.classList.add('dark'); // Tambahkan 'dark' jika tema gelap
      } else {
        root.classList.add('light'); // Atau 'light' jika terang
      }
      localStorage.setItem('smartlab-theme', theme);
    }, [theme]);

  // Jika panel tidak terbuka, jangan render apa-apa
  if (!isOpen) {
    return null;
  }

  return (
    <div className="settings-overlay" onClick={onClose}> {/* Overlay untuk menutup saat klik di luar */}
      <div className="settings-panel" onClick={(e) => e.stopPropagation()}> {/* Panel agar klik di dalam tidak menutup */}
        <div className="settings-header">
          <h3>Pengaturan Tampilan</h3>
          <button onClick={onClose} className="close-settings-btn">×</button>
        </div>
        <div className="settings-body">
          <p>Pilih Tema:</p>
          <div className="theme-options">
            <button
              onClick={() => setTheme('light')}
              className={`theme-btn ${theme === 'light' ? 'active' : ''}`}
            >
              Terang
            </button>
            <button
              onClick={() => setTheme('dark')}
              className={`theme-btn ${theme === 'dark' ? 'active' : ''}`}
            >
              Gelap
            </button>
             {/* Anda bisa menambahkan opsi 'System' jika Tailwind dikonfigurasi */}
             {/* <button onClick={() => setTheme('system')}>System</button> */}
          </div>
        </div>
      </div>
    </div>
  );
}
