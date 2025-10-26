// src/features/ar-lab/arLabUtils.ts

// Hapus semua impor dari @mediapipe/tasks-vision dari file ini

// Definisikan tipe dasar di sini
type Point = { x: number; y: number };
type MeasurementUnit = 'cm' | 'mm' | 'm' | 'inch' | 'ft';

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

// Fungsi menggambar deteksi tangan
// Gunakan tipe any[][] untuk landmarks
export const drawHandLandmarks = (ctx: CanvasRenderingContext2D, landmarks: any[][] | undefined, width: number, height: number) => {
    if (!landmarks || landmarks.length === 0) return;
    ctx.fillStyle = "aqua";
    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;
    for (const hand of landmarks) {
        // Asumsi hand adalah array of {x, y, z}
        if (Array.isArray(hand)) {
            for (const point of hand) {
                if (point && typeof point.x === 'number' && typeof point.y === 'number') {
                    const x = point.x * width;
                    const y = point.y * height;
                    ctx.beginPath();
                    ctx.arc(x, y, 5, 0, 2 * Math.PI);
                    ctx.fill();
                    ctx.stroke();
                }
            }
        }
    }
};

// Fungsi menggambar deteksi wajah
// Gunakan tipe any[] untuk detections, karena strukturnya bervariasi
export const drawFaceDetections = (ctx: CanvasRenderingContext2D, detections: any[] | undefined) => {
    if (!detections || detections.length === 0) return;
    ctx.strokeStyle = 'lime';
    ctx.lineWidth = 3;
    for (const detection of detections) {
        // Asumsi detection memiliki boundingBox { originX, originY, width, height }
        const bbox = detection.boundingBox;
        if (bbox && typeof bbox.originX === 'number') {
            ctx.beginPath();
            ctx.rect(bbox.originX, bbox.originY, bbox.width, bbox.height);
            ctx.stroke();
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
