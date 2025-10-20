// Di sini kita menaruh semua rumus yang diubah dari Python ke TypeScript

/**
 * Menghitung volume balok.
 * @param panjang - Panjang balok (meter)
 * @param lebar - Lebar balok (meter)
 * @param tinggi - Tinggi balok (meter)
 * @returns Volume dalam meter kubik
 */
export function hitungVolumeBalok(panjang: number, lebar: number, tinggi: number): number {
  if (panjang <= 0 || lebar <= 0 || tinggi <= 0) {
    return 0;
  }
  return panjang * lebar * tinggi;
}

/**
 * Menghitung kecepatan.
 * @param jarak - Jarak yang ditempuh (meter)
 * @param waktu - Waktu yang dibutuhkan (detik)
 * @returns Kecepatan dalam m/s
 */
export function hitungKecepatan(jarak: number, waktu: number): number {
  if (waktu <= 0) {
    return 0;
  }
  return jarak / waktu;
}