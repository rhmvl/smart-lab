// src/features/ar-lab/arLabUtils.ts

// Hapus semua impor dari @mediapipe/tasks-vision dari file ini

// Definisikan tipe dasar di sini
type Point = { x: number; y: number };
type MeasurementUnit = 'cm' | 'mm' | 'm' | 'inch' | 'ft';

// === DEFINISI KONEKSI SENDI TANGAN (berdasarkan MediaPipe) ===
// Ini adalah pasangan indeks dari 21 titik landmark tangan
const HAND_CONNECTIONS = [
[0, 1], [1, 2], [2, 3], [3, 4], // Ibu Jari
[0, 5], [5, 6], [6, 7], [7, 8], // Telunjuk
[0, 9], [9, 10], [10, 11], [11, 12], // Jari Tengah
[0, 13], [13, 14], [14, 15], [15, 16], // Jari Manis
[0, 17], [17, 18], [18, 19], [19, 20], // Kelingking
[5, 9], [9, 13], [13, 17], [17, 5] // Telapak Tangan (Loop tertutup)
];
// ========================================================


// Fungsi untuk mendapatkan koordinat relatif terhadap elemen
export const getCoords = (e: React.MouseEvent | React.TouchEvent, canvasElement: HTMLCanvasElement | null): Point => {
    if (!canvasElement) return { x: 0, y: 0 };
    const rect = canvasElement.getBoundingClientRect();
    let clientX, clientY;
    if ('touches' in e) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
    } else {
        clientX = e.clientX;
        clientY = e.clientY;
    }
    return {
        x: clientX - rect.left,
        y: clientY - rect.top
    };
};

// Fungsi menggambar deteksi tangan (dengan garis sendi)
export const drawHandLandmarks = (ctx: CanvasRenderingContext2D, landmarks: any[][] | undefined, width: number, height: number) => {
    if (!landmarks || landmarks.length === 0) return;

    for (const hand of landmarks) {
        // Pastikan 'hand' adalah array dan memiliki 21 titik
        if (Array.isArray(hand) && hand.length === 21) {

            // --- 1. Gambar Garis Koneksi (Hijau) ---
            ctx.strokeStyle = "lime"; // Warna garis koneksi (Hijau)
            ctx.lineWidth = 3; // Garis tebal

            for (const connection of HAND_CONNECTIONS) {
                const startPoint = hand[connection[0]];
                const endPoint = hand[connection[1]];

                // Pastikan kedua titik ada
                if (startPoint && typeof startPoint.x === 'number' && endPoint && typeof endPoint.x === 'number') {
                    ctx.beginPath();
                    ctx.moveTo(startPoint.x * width, startPoint.y * height);
                    ctx.lineTo(endPoint.x * width, endPoint.y * height);
                    ctx.stroke();
                }
            }

            // --- 2. Gambar Titik Sendi (Aqua/Biru Muda) ---
            ctx.fillStyle = "aqua"; // Warna titik tangan (Biru Muda)
            ctx.strokeStyle = "white"; // Border titik
            ctx.lineWidth = 1; // Garis tipis

            for (const point of hand) {
                if (point && typeof point.x === 'number' && typeof point.y === 'number') {
                    const x = point.x * width;
                    const y = point.y * height;
                    ctx.beginPath();
                    ctx.arc(x, y, 5, 0, 2 * Math.PI); // Ukuran titik 5px
                    ctx.fill();
                    ctx.stroke();
                }
            }
        }
    }
};

// Fungsi menggambar deteksi wajah
export const drawFaceDetections = (ctx: CanvasRenderingContext2D, detections: any[] | undefined) => {
    if (!detections || detections.length === 0) return;
    ctx.strokeStyle = 'lime'; // Warna kotak wajah (Hijau)
    ctx.lineWidth = 3;
    ctx.fillStyle = 'rgba(0, 255, 0, 0.1)'; // Isi kotak transparan (opsional)

    for (const detection of detections) {
        const bbox = detection.boundingBox;
        if (bbox && typeof bbox.originX === 'number') {
            // Gambar kotak
            ctx.beginPath();
            ctx.rect(bbox.originX, bbox.originY, bbox.width, bbox.height);
            ctx.stroke();
            ctx.fill(); // Isi kotak (opsional)
        }
    }
};

// Fungsi konversi jarak
export const convertDistance = (pixels: number, pixelsPerUnit: number | null, currentUnit: MeasurementUnit): number => {
    if (!pixelsPerUnit || pixels === 0) return 0;
    const distanceInCm = pixels / pixelsPerUnit;
    switch (currentUnit) {
        case 'mm': return distanceInCm * 10;
        case 'm': return distanceInCm / 100;
        case 'inch': return distanceInCm / 2.54;
        case 'ft': return distanceInCm / 30.48;
        case 'cm':
        default: return distanceInCm;
    }
};
