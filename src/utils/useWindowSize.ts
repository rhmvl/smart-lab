// src/hooks/useWindowSize.ts
import { useState, useEffect } from 'react';

// Definisikan tipe data untuk ukuran jendela
interface WindowSize {
  width: number | undefined;
  height: number | undefined;
}

function useWindowSize(): WindowSize {
  // 1. Buat state untuk menyimpan ukuran jendela
  const [windowSize, setWindowSize] = useState<WindowSize>({
    width: undefined,
    height: undefined,
  });

  useEffect(() => {
    // 2. Buat fungsi handler yang akan dipanggil saat jendela di-resize
    function handleResize() {
      // Set state dengan lebar dan tinggi jendela saat ini
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    // 3. Tambahkan event listener saat komponen pertama kali dimuat (mount)
    window.addEventListener("resize", handleResize);

    // 4. Panggil handler sekali saat awal untuk mendapatkan ukuran awal
    handleResize();

    // 5. Hapus event listener saat komponen dilepas (unmount)
    //    Ini penting untuk mencegah kebocoran memori!
    return () => window.removeEventListener("resize", handleResize);
  }, []); // Array dependensi kosong [] memastikan efek ini hanya berjalan sekali saat mount

  // 6. Kembalikan state ukuran jendela
  return windowSize;
}

export default useWindowSize;
