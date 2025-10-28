// src/features/ar-lab/useArLabLogic.ts
import { useEffect, useRef, useState, useCallback } from 'react';
import { HandLandmarker, FaceDetector, FilesetResolver } from '@mediapipe/tasks-vision';
import { getCoords, drawHandLandmarks, drawFaceDetections, convertDistance } from './arLabUtils';
// Hapus impor TensorFlow.js jika Anda tidak jadi menggunakannya
// import * as tf from '@tensorflow/tfjs';

// Tipe data
export type Point = { x: number; y: number };
export type FacingMode = 'environment' | 'user';
export type DetectionMode = 'measure' | 'hand' | 'face' | 'age'; // Tambah mode 'age'
export type MeasurementUnit = 'cm' | 'mm' | 'm' | 'inch' | 'ft';

// Variabel global
// let ageModel: tf.GraphModel | undefined = undefined; // Model umur
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
    const [detectedAge, setDetectedAge] = useState<number | null>(null); // State untuk umur

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

            // Tambahkan pemuatan model umur di sini jika sudah siap
            // setLoadingStatus('Memuat model Deteksi Umur...');
            // ageModel = await tf.loadGraphModel('URL_MODEL_ANDA/model.json');
            // console.log("Model deteksi umur berhasil dimuat.");

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
            if (requestPredictionFrame) {
                cancelAnimationFrame(requestPredictionFrame);
                requestPredictionFrame = undefined;
            }
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
                videoRef.current.onloadedmetadata = () => {
                    videoRef.current?.play().catch(playErr => {
                        console.error("Gagal memulai play video:", playErr);
                        setErrorMsg("Gagal memulai video. Coba lagi.");
                    });
                    streamRef.current = stream;
                    setStreamActive(true);
                    console.log("Stream kamera aktif.");
                    if (modelsReady && !requestPredictionFrame) {
                        console.log("Memulai loop prediksi...");
                        lastVideoTime = -1;
                        predictWebcam();
                    }
                };
                videoRef.current.onerror = (e) => {
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
    }, [facingMode, modelsReady]); // dependensi predictWebcam dihapus

    // --- FUNGSI ESTIMASI UMUR (Placeholder, aktifkan jika model umur ada) ---
    const runAgeEstimation = useCallback(async (video: HTMLVideoElement, bbox: any, ctx: CanvasRenderingContext2D) => {
        // if (!ageModel) {
        //      ctx.fillStyle = 'red'; ctx.font = '18px Arial'; ctx.textAlign = 'center';
        //      ctx.fillText("Model Umur Belum Dimuat", bbox.originX + bbox.width / 2, bbox.originY - 30);
        //      return;
        // }
        // try {
        //     const videoTensor = tf.browser.fromPixels(video);
        //     const faceTensor = videoTensor.slice([bbox.originY, bbox.originX, 0], [bbox.height, bbox.width, 3]);
        //     const inputTensor = tf.image.resizeBilinear(faceTensor, [128, 128]).div(tf.scalar(255)).expandDims(0);
        //     const prediction = ageModel.predict(inputTensor) as tf.Tensor;
        //     const estimatedAge = (await prediction.data())[0];
        //     setDetectedAge(estimatedAge);
        //     ctx.fillStyle = 'yellow'; ctx.font = '20px Arial'; ctx.textAlign = 'center';
        //     ctx.fillText(`Estimasi Umur: ${Math.round(estimatedAge)}`, bbox.originX + bbox.width / 2, bbox.originY - 10);
        //     videoTensor.dispose(); faceTensor.dispose(); inputTensor.dispose(); prediction.dispose();
        // } catch (err) { console.error("Error estimasi umur:", err); }
    }, []); // Dependensi kosong

    // --- LOOP PREDIKSI MEDIAPIPE & MENGGAMBAR ---
    const predictWebcam = useCallback(() => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (!video || !canvas || !streamActive || video.readyState < 2 || video.videoWidth === 0) {
            requestPredictionFrame = requestAnimationFrame(predictWebcam); return;
        }
        if (video.currentTime === lastVideoTime) {
            requestPredictionFrame = requestAnimationFrame(predictWebcam); return;
        }
        lastVideoTime = video.currentTime;
        const ctx = canvas.getContext('2d');
        if (!ctx) { requestPredictionFrame = requestAnimationFrame(predictWebcam); return; }

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (modelsReady) {
            try {
                if (detectionMode === 'hand' && handLandmarker) {
                    const handResults = handLandmarker.detectForVideo(video, Date.now());
                    drawHandLandmarks(ctx, handResults.landmarks, canvas.width, canvas.height);
                } else if (detectionMode === 'face' && faceDetector) {
                    const faceResults = faceDetector.detectForVideo(video, Date.now());
                    drawFaceDetections(ctx, faceResults.detections);
                } else if (detectionMode === 'age' && faceDetector) {
                    const faceResults = faceDetector.detectForVideo(video, Date.now());
                    drawFaceDetections(ctx, faceResults.detections);
                    if (faceResults.detections.length > 0) {
                        const bbox = faceResults.detections[0].boundingBox;
                        // Panggil estimasi umur (masih placeholder)
                        // runAgeEstimation(video, bbox, ctx);
                    }
                } else if (detectionMode === 'measure' && startPoint && endPoint) {
                    const scaleX = canvas.width / video.clientWidth;
                    const scaleY = canvas.height / video.clientHeight;
                    const scaledStart = { x: startPoint.x * scaleX, y: startPoint.y * scaleY };
                    const scaledEnd = { x: endPoint.x * scaleX, y: endPoint.y * scaleY };
                    ctx.beginPath(); ctx.moveTo(scaledStart.x, scaledStart.y); ctx.lineTo(scaledEnd.x, scaledEnd.y);
                    ctx.strokeStyle = 'yellow'; ctx.lineWidth = 4; ctx.lineCap = 'round'; ctx.stroke();
                    ctx.fillStyle = 'red'; ctx.beginPath(); ctx.arc(scaledStart.x, scaledStart.y, 8, 0, 2 * Math.PI); ctx.fill();
                    ctx.fillStyle = 'blue'; ctx.beginPath(); ctx.arc(scaledEnd.x, scaledEnd.y, 8, 0, 2 * Math.PI); ctx.fill();
                }
            } catch (detectionError) {
                console.error("Error saat deteksi/gambar:", detectionError);
            }
        }
        requestPredictionFrame = requestAnimationFrame(predictWebcam);
    }, [streamActive, modelsReady, detectionMode, startPoint, endPoint, runAgeEstimation]); // Dependensi sudah benar

    // --- useEffect UTAMA ---
    useEffect(() => { setupModels(); }, [setupModels]);
    useEffect(() => {
        if (modelsReady) { startCamera(); }
        return () => { // Kode cleanup
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
                streamRef.current = null;
            }
            if (requestPredictionFrame) {
                cancelAnimationFrame(requestPredictionFrame);
                requestPredictionFrame = undefined;
            }
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
    }, []);

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
        // Hitung jarak piksel di layar
        const rect = canvasRef.current!.getBoundingClientRect();
        const scaleX = canvasRef.current!.width / rect.width;
        const scaleY = canvasRef.current!.height / rect.height;
        const dx = (endPoint.x - startPoint.x) * scaleX; // Gunakan koordinat canvas yang diskalakan
        const dy = (endPoint.y - startPoint.y) * scaleY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        setPixelDistance(dist); // Jarak dalam piksel video/canvas asli
    }, [isDrawing, startPoint, endPoint, detectionMode]);


    const handleCalibrate = useCallback(() => {
        if (pixelDistance === 0) {
            setErrorMsg("Gambar garis pada objek referensi terlebih dahulu!"); return;
        }
        const lengthInCm = parseFloat(knownLength);
        if (isNaN(lengthInCm) || lengthInCm <= 0) {
            setErrorMsg("Masukkan panjang referensi yang valid dalam cm."); return;
        }
        // Rasio piksel (video/canvas asli) per cm (dunia nyata)
        setPixelsPerUnit(pixelDistance / lengthInCm);
        setMeasureMode('measure'); setErrorMsg(''); setPixelDistance(0); setStartPoint(null); setEndPoint(null);
    }, [pixelDistance, knownLength]);

    const saveCurrentMeasurement = useCallback(() => {
        const valueToSave = convertDistance(pixelDistance, pixelsPerUnit, currentUnit);
        if (valueToSave > 0) {
            setSavedMeasurements(prev => [valueToSave, ...prev.slice(0, 4)]);
        }
        setPixelDistance(0); setStartPoint(null); setEndPoint(null);
    }, [pixelDistance, pixelsPerUnit, currentUnit]);

    const sendToCalculator = useCallback((measurement: number) => {
        alert(`Mengirim ${measurement.toFixed(2)} ${currentUnit} ke Kalkulator (fitur belum aktif)`);
    }, [currentUnit]);

    // Nilai dan fungsi yang dikembalikan oleh hook
    return {
        videoRef, canvasRef, errorMsg, streamActive, facingMode, modelsReady, loadingStatus,
        detectionMode, measureMode, pixelsPerUnit, knownLength, currentUnit, savedMeasurements,
        pixelDistance, startPoint, endPoint, detectedAge,
        flipCamera, setDetectionMode, setMeasureMode,
        setKnownLength, handleCalibrate, setCurrentUnit, saveCurrentMeasurement, sendToCalculator,
        handleDrawStart, handleDrawMove, handleDrawEnd, convertDistance
    };
}
