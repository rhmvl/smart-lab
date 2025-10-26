// src/features/ar-lab/useArLabLogic.ts
import { useEffect, useRef, useState, useCallback } from 'react';
import { HandLandmarker, FaceDetector, FilesetResolver } from '@mediapipe/tasks-vision';
import { getCoords, drawHandLandmarks, drawFaceDetections, convertDistance } from './arLabUtils';

// Tipe data
export type Point = { x: number; y: number };
export type FacingMode = 'environment' | 'user';
export type DetectionMode = 'measure' | 'hand' | 'face';
export type MeasurementUnit = 'cm' | 'mm' | 'm' | 'inch' | 'ft';

// Variabel global
let handLandmarker: HandLandmarker | undefined = undefined;
let faceDetector: FaceDetector | undefined = undefined;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
let lastVideoTime = -1;
let requestPredictionFrame: number | undefined = undefined;

export function useArLabLogic() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const streamRef = useRef<MediaStream | null>(null);

    // State Utama
    const [errorMsg, setErrorMsg] = useState('');
    const [streamActive, setStreamActive] = useState(false);
    const [facingMode, setFacingMode] = useState<FacingMode>('environment');
    const [modelsReady, setModelsReady] = useState(false);
    const [loadingStatus, setLoadingStatus] = useState('Menginisialisasi...');
    const [detectionMode, setDetectionMode] = useState<DetectionMode>('measure');

    // State Pengukuran & Kalibrasi
    const [measureMode, setMeasureMode] = useState<'calibrate' | 'measure'>('calibrate');
    const [pixelsPerUnit, setPixelsPerUnit] = useState<number | null>(null);
    const [knownLength, setKnownLength] = useState('8.56');
    const [currentUnit, setCurrentUnit] = useState<MeasurementUnit>('cm');
    const [savedMeasurements, setSavedMeasurements] = useState<number[]>([]);

    // State Menggambar
    const [isDrawing, setIsDrawing] = useState(false);
    const [startPoint, setStartPoint] = useState<Point | null>(null);
    const [endPoint, setEndPoint] = useState<Point | null>(null);
    const [pixelDistance, setPixelDistance] = useState(0);

    // --- FUNGSI SETUP & KAMERA ---
    const setupModels = useCallback(async () => {
        try {
            setLoadingStatus('Memuat runtime Vision...');
            const vision = await FilesetResolver.forVisionTasks(
                "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
            );

            setLoadingStatus('Memuat model Deteksi Tangan...');
            handLandmarker = await HandLandmarker.createFromOptions(vision, {
                baseOptions: { modelAssetPath: "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task", delegate: "GPU" },
                runningMode: "VIDEO", numHands: 1
            });
            console.log("Model deteksi tangan berhasil dimuat.");

            setLoadingStatus('Memuat model Deteksi Wajah...');
            faceDetector = await FaceDetector.createFromOptions(vision, {
                baseOptions: { modelAssetPath: `https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/1/blaze_face_short_range.tflite`, delegate: "GPU" },
                runningMode: "VIDEO"
            });
            console.log("Model deteksi wajah berhasil dimuat.");

            setLoadingStatus('Model siap!');
            setModelsReady(true);
        } catch (err) {
            console.error("Gagal memuat model:", err);
            setErrorMsg("Gagal memuat model AI. Periksa koneksi internet atau coba muat ulang.");
            setLoadingStatus('Gagal memuat model.');
        }
    }, []); // Dependensi kosong, hanya dijalankan sekali saat mount

    const startCamera = useCallback(async () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            if (requestPredictionFrame) cancelAnimationFrame(requestPredictionFrame);
            requestPredictionFrame = undefined;
        }
        setErrorMsg(''); setStreamActive(false); console.log(`Mencoba memulai kamera: ${facingMode}`);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: facingMode,
                    width: { ideal: 1280 },
                    height: { ideal: 720 }
                }
            });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.onloadedmetadata = () => { // Gunakan event ini
                    videoRef.current?.play().catch(playErr => { // Tambahkan catch error untuk play
                        console.error("Gagal memulai play video:", playErr);
                        setErrorMsg("Gagal memulai video. Coba lagi.");
                    });
                    streamRef.current = stream;
                    setStreamActive(true);
                    console.log("Stream kamera aktif.");
                    if (modelsReady && !requestPredictionFrame) { // Mulai prediksi jika model siap & loop belum jalan
                        console.log("Memulai loop prediksi...");
                        lastVideoTime = -1; // Reset lastVideoTime saat kamera baru dimulai
                        predictWebcam();
                    }
                };
                videoRef.current.onerror = (e) => { // Tambahkan error handler untuk video
                    console.error("Video error:", e);
                    setErrorMsg("Terjadi masalah saat memutar video kamera.");
                };
            }
        } catch (err) {
            console.error("Error mengakses kamera:", err);
            if (err instanceof Error) {
                if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") setErrorMsg(`Tidak ditemukan kamera ${facingMode === 'user' ? 'depan' : 'belakang'}.`);
                else if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") setErrorMsg("Izin kamera ditolak.");
                else if (err.name === "OverconstrainedError" || err.name === "ConstraintNotSatisfiedError") setErrorMsg("Resolusi kamera tidak didukung.");
                else setErrorMsg(`Gagal memulai kamera (${err.name}).`);
            } else setErrorMsg("Gagal memulai kamera.");
        }
    }, [facingMode, modelsReady]); // predictWebcam tidak perlu di dependensi startCamera

    // --- LOOP PREDIKSI MEDIAPIPE & MENGGAMBAR ---
    const predictWebcam = useCallback(() => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (!video || !canvas || !streamActive || video.readyState < video.HAVE_METADATA || video.paused || video.ended || video.videoWidth === 0) {
            requestPredictionFrame = requestAnimationFrame(predictWebcam); return;
        }
        if (video.currentTime === lastVideoTime) {
            requestPredictionFrame = requestAnimationFrame(predictWebcam); return;
        }
        lastVideoTime = video.currentTime;
        const ctx = canvas.getContext('2d');
        if (!ctx) { requestPredictionFrame = requestAnimationFrame(predictWebcam); return; }

        canvas.width = video.videoWidth; canvas.height = video.videoHeight;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Deteksi sesuai mode
        if (modelsReady) {
            try { // Tambahkan try-catch untuk deteksi
                if (detectionMode === 'hand' && handLandmarker) {
                    const handResults = handLandmarker.detectForVideo(video, Date.now());
                    drawHandLandmarks(ctx, handResults.landmarks, canvas.width, canvas.height);
                } else if (detectionMode === 'face' && faceDetector) {
                    const faceResults = faceDetector.detectForVideo(video, Date.now());
                    drawFaceDetections(ctx, faceResults.detections);
                }
            } catch (detectionError) {
                console.error("Error saat deteksi:", detectionError);
                // Mungkin tampilkan pesan error singkat ke user
            }
        }

        // Gambar garis pengukuran
        if (detectionMode === 'measure' && startPoint && endPoint) {
            // Skalakan koordinat dari ukuran tampilan (clientWidth/Height) ke ukuran asli canvas (width/height)
            const scaleX = canvas.width / video.clientWidth;
            const scaleY = canvas.height / video.clientHeight;
            const scaledStart = { x: startPoint.x * scaleX, y: startPoint.y * scaleY };
            const scaledEnd = { x: endPoint.x * scaleX, y: endPoint.y * scaleY };

            ctx.beginPath(); ctx.moveTo(scaledStart.x, scaledStart.y); ctx.lineTo(scaledEnd.x, scaledEnd.y);
            ctx.strokeStyle = 'yellow'; ctx.lineWidth = 4; ctx.lineCap = 'round'; ctx.stroke(); // Tambah lineCap
            ctx.fillStyle = 'red'; ctx.beginPath(); ctx.arc(scaledStart.x, scaledStart.y, 8, 0, 2 * Math.PI); ctx.fill();
            ctx.fillStyle = 'blue'; ctx.beginPath(); ctx.arc(scaledEnd.x, scaledEnd.y, 8, 0, 2 * Math.PI); ctx.fill();
        }

        requestPredictionFrame = requestAnimationFrame(predictWebcam);
    }, [streamActive, modelsReady, detectionMode, startPoint, endPoint]); // Dependensi sudah benar

    // --- useEffect UTAMA ---
    useEffect(() => { setupModels(); }, [setupModels]);
    useEffect(() => {
        if (modelsReady) { startCamera(); }
        return () => { // Kode cleanup
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
                streamRef.current = null; // Reset ref
            }
            if (requestPredictionFrame) {
                cancelAnimationFrame(requestPredictionFrame);
                requestPredictionFrame = undefined;
            }
            // Hapus event listener video saat unmount
            if(videoRef.current) {
                videoRef.current.onloadedmetadata = null;
                videoRef.current.onerror = null;
            }
        };
    }, [facingMode, modelsReady, startCamera]); // Dependensi sudah benar

    // --- EVENT HANDLERS ---
    const flipCamera = useCallback(() => {
        if (requestPredictionFrame) {
            cancelAnimationFrame(requestPredictionFrame);
            requestPredictionFrame = undefined;
            console.log("Loop prediksi dihentikan untuk membalik kamera.");
        }
        setFacingMode(prevMode => (prevMode === 'user' ? 'environment' : 'user'));
        setStartPoint(null); setEndPoint(null); setPixelDistance(0);
        setMeasureMode('calibrate'); setPixelsPerUnit(null); setSavedMeasurements([]);
    }, []); // Tidak ada dependensi

    const handleDrawStart = useCallback((e: React.MouseEvent | React.TouchEvent) => {
        if (detectionMode !== 'measure') return; e.preventDefault(); setIsDrawing(true);
        const point = getCoords(e, canvasRef.current); setStartPoint(point); setEndPoint(point); setPixelDistance(0);
    }, [detectionMode]);

    const handleDrawMove = useCallback((e: React.MouseEvent | React.TouchEvent) => {
        if (!isDrawing || detectionMode !== 'measure') return; e.preventDefault();
        const point = getCoords(e, canvasRef.current); setEndPoint(point);
    }, [isDrawing, detectionMode]);

    const handleDrawEnd = useCallback(() => {
        if (!isDrawing || !startPoint || !endPoint || detectionMode !== 'measure') return; setIsDrawing(false);
        // Hitung jarak piksel di layar (bukan piksel video asli) agar konsisten
        const rect = canvasRef.current!.getBoundingClientRect();
        const clientDx = (endPoint.x / (canvasRef.current!.width / rect.width)) - (startPoint.x / (canvasRef.current!.width / rect.width));
        const clientDy = (endPoint.y / (canvasRef.current!.height / rect.height)) - (startPoint.y / (canvasRef.current!.height / rect.height));
        const clientDist = Math.sqrt(clientDx * clientDx + clientDy * clientDy);

        setPixelDistance(clientDist); // Gunakan jarak piksel layar
    }, [isDrawing, startPoint, endPoint, detectionMode]);

    const handleCalibrate = useCallback(() => {
        if (pixelDistance === 0) {
            setErrorMsg("Gambar garis pada objek referensi terlebih dahulu!"); return;
        }
        const lengthInCm = parseFloat(knownLength);
        if (isNaN(lengthInCm) || lengthInCm <= 0) {
            setErrorMsg("Masukkan panjang referensi yang valid dalam cm."); return;
        }
        // Rasio piksel (di layar) per cm (di dunia nyata)
        setPixelsPerUnit(pixelDistance / lengthInCm);
        setMeasureMode('measure'); setErrorMsg(''); setPixelDistance(0); setStartPoint(null); setEndPoint(null);
    }, [pixelDistance, knownLength]);

    const saveCurrentMeasurement = useCallback(() => {
        const valueToSave = convertDistance(pixelDistance, pixelsPerUnit, currentUnit); // Gunakan utilitas
        if (valueToSave > 0) {
            setSavedMeasurements(prev => [valueToSave, ...prev.slice(0, 4)]);
        }
        // Reset setelah menyimpan? Opsional
        setPixelDistance(0); setStartPoint(null); setEndPoint(null);
    }, [pixelDistance, pixelsPerUnit, currentUnit]); // convertDistance tidak perlu jadi dependensi

    const sendToCalculator = useCallback((measurement: number) => {
        alert(`Mengirim ${measurement.toFixed(2)} ${currentUnit} ke Kalkulator (fitur belum aktif)`);
    }, [currentUnit]);

    // Nilai dan fungsi yang dikembalikan oleh hook
    return {
        videoRef, canvasRef, errorMsg, streamActive, facingMode, modelsReady, loadingStatus,
        detectionMode, measureMode, pixelsPerUnit, knownLength, currentUnit, savedMeasurements,
        pixelDistance, startPoint, endPoint, // Kembalikan state gambar
        flipCamera, setDetectionMode, setMeasureMode, // Kembalikan setter
        setKnownLength, handleCalibrate, setCurrentUnit, saveCurrentMeasurement, sendToCalculator,
        handleDrawStart, handleDrawMove, handleDrawEnd, convertDistance // Kembalikan handler & utilitas
    };
}
