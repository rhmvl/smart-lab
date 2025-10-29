import { Link } from 'react-router-dom';
import { Camera, Crosshair } from 'lucide-react'; // Impor ikon

export default function ArLabMenu() {
  return (
    <div className="flex flex-col items-center p-8 text-center page-enter-animation"> {/* Tambah animasi masuk */}
      <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
        AR Lab
      </h1>
      <p className="text-lg text-gray-600 dark:text-gray-300 mb-10">
        Pilih mode alat ukur augmentasi yang ingin Anda gunakan.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl">
        {/* Tombol ke Mode 1 (UI Lama) */}
        <Link to="measure" className="feature-card-link"> {/* Link ke "measure" */}
          <Camera size={32} />
          <h3 className="text-xl font-semibold mt-4">Mode Kalibrasi & Deteksi</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Mengukur benda dan mendeteksi fitur wajah/tangan menggunakan kalibrasi manual.
          </p>
        </Link>

        {/* Tombol ke Mode 2 (UI Baru) */}
        <Link to="crosshair" className="feature-card-link"> {/* Link ke "crosshair" */}
          <Crosshair size={32} />
          <h3 className="text-xl font-semibold mt-4">Mode Crosshair (Segera Hadir)</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Mengukur dengan crosshair di tengah layar dan tombol penanda.
          </p>
        </Link>
      </div>
    </div>
  );
}
