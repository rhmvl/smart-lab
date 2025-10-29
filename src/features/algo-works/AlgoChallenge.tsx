import React from 'react';
// Impor komponen placeholder (pastikan path-nya benar)
import { FeatureView } from '../../components/layout/FeatureView';

export default function AlgoChallenge() {
  return (
    <div className="page-enter-animation">
      <FeatureView
        title="Belajar & Tantangan (Segera Hadir)"
        description="Mode ini sedang dalam pengembangan. Nantinya, di sini akan ada tantangan dan kuis interaktif untuk menguji pemahaman Anda tentang algoritma."
        bgColor="bg-green-700" // Anda bisa ganti warnanya
      />
    </div>
  );
}
