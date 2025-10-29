import { FeatureView } from '../../components/layout/FeatureView'; // Impor komponen placeholder

export default function ArLabCrosshair() {
  return (
    <div className="page-enter-animation"> {/* Tambah animasi masuk */}
      <FeatureView
        title="Mode Crosshair (Dalam Pengembangan)"
        description="Fitur ini sedang kami siapkan. Anda akan bisa mengukur objek dengan membidiknya menggunakan crosshair di tengah layar."
        bgColor="bg-gray-700"
      />
    </div>
  );
}
