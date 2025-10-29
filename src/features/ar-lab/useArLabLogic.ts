import { useEffect, useRef, useState, useCallback } from 'react';
import { HandLandmarker, FaceDetector, FilesetResolver } from '@mediapipe/tasks-vision';
import { getCoords, drawHandLandmarks, drawFaceDetections, convertDistance } from './arLabUtils';

export type Point = { x: number; y: number };
export type FacingMode = 'environment' | 'user';
export type DetectionMode = 'measure' | 'hand' | 'face' | 'age';
export type MeasurementUnit = 'cm' | 'mm' | 'm' | 'inch' | 'ft';

// let ageModel: tf.GraphModel | undefined;
let handLandmarker: HandLandmarker | undefined;
let faceDetector: FaceDetector | undefined;
let lastVideoTime = -1;
let requestPredictionFrame: number | undefined;

export function useArLabLogic() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [errorMsg, setErrorMsg] = useState('');
  const [streamActive, setStreamActive] = useState(false);
  const [facingMode, setFacingMode] = useState<FacingMode>('environment');
  const [modelsReady, setModelsReady] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState('Menginisialisasi...');
  const [detectionMode, setDetectionMode] = useState<DetectionMode>('measure');
  const [detectedAge] = useState<number | null>(null);

  const [measureMode, setMeasureMode] = useState<'calibrate' | 'measure'>('calibrate');
  const [pixelsPerUnit, setPixelsPerUnit] = useState<number | null>(null);
  const [knownLength, setKnownLength] = useState('8.56');
  const [currentUnit, setCurrentUnit] = useState<MeasurementUnit>('cm');
  const [savedMeasurements, setSavedMeasurements] = useState<number[]>([]);

  const [isDrawing, setIsDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState<Point | null>(null);
  const [endPoint, setEndPoint] = useState<Point | null>(null);
  const [pixelDistance, setPixelDistance] = useState(0);

  const setupModels = useCallback(async () => {
    try {
      setLoadingStatus('Memuat runtime Vision...');
      const vision = await FilesetResolver.forVisionTasks(
        'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
      );

      setLoadingStatus('Memuat model Deteksi Tangan...');
      handLandmarker = await HandLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath:
            'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task',
          delegate: 'GPU'
        },
        runningMode: 'VIDEO',
        numHands: 1
      });
      console.log('✅ HandLandmarker loaded');

      setLoadingStatus('Memuat model Deteksi Wajah...');
      faceDetector = await FaceDetector.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath:
            'https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/1/blaze_face_short_range.tflite',
          delegate: 'GPU'
        },
        runningMode: 'VIDEO'
      });
      console.log('✅ FaceDetector loaded');

      setLoadingStatus('Model siap!');
      setModelsReady(true);
    } catch (err) {
      console.error('❌ Failed to load models:', err);
      setErrorMsg('Gagal memuat model AI. Periksa koneksi internet atau coba lagi.');
      setLoadingStatus('Gagal memuat model.');
    }
  }, []);

  const startCamera = useCallback(async () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      if (requestPredictionFrame) {
        cancelAnimationFrame(requestPredictionFrame);
        requestPredictionFrame = undefined;
      }
    }

    setErrorMsg('');
    setStreamActive(false);
    console.log(`🎥 Starting camera (${facingMode})...`);

    try {
      // TODO: ADD NOTICE WHEN THE CAMERA CANNOT BE LOADED
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode, width: { ideal: 1280 }, height: { ideal: 720 } }
      });

      if (!videoRef.current) return;

      videoRef.current.srcObject = stream;
      videoRef.current.onloadedmetadata = () => {
        videoRef.current
          ?.play()
          .then(() => {
            streamRef.current = stream;
            setStreamActive(true);
            console.log('✅ Camera stream active');

            if (modelsReady && !requestPredictionFrame) {
              console.log('▶️ Starting prediction loop...');
              lastVideoTime = -1;
              predictWebcam();
            }
          })
          .catch(err => {
            console.error('Video play error:', err);
            setErrorMsg('Gagal memulai video.');
          });
      };

      videoRef.current.onerror = e => {
        console.error('Video error:', e);
        setErrorMsg('Terjadi masalah saat memutar video.');
      };
    } catch (err: any) {
      console.error('Camera access error:', err);
      switch (err.name) {
        case 'NotFoundError':
        case 'DevicesNotFoundError':
          setErrorMsg(`Tidak ditemukan kamera ${facingMode === 'user' ? 'depan' : 'belakang'}.`);
          break;
        case 'NotAllowedError':
        case 'PermissionDeniedError':
          setErrorMsg('Izin kamera ditolak.');
          break;
        case 'OverconstrainedError':
        case 'ConstraintNotSatisfiedError':
          setErrorMsg('Resolusi kamera tidak didukung.');
          break;
        default:
          setErrorMsg(`Gagal memulai kamera (${err.name}).`);
      }
    }
  }, [facingMode, modelsReady]);

  const predictWebcam = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || !streamActive || video.readyState < 2 || video.videoWidth === 0) {
      requestPredictionFrame = requestAnimationFrame(predictWebcam);
      return;
    }

    if (video.currentTime === lastVideoTime) {
      requestPredictionFrame = requestAnimationFrame(predictWebcam);
      return;
    }

    lastVideoTime = video.currentTime;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      requestPredictionFrame = requestAnimationFrame(predictWebcam);
      return;
    }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!modelsReady) {
      requestPredictionFrame = requestAnimationFrame(predictWebcam);
      return;
    }

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
        // Future: Age estimation here
      } else if (detectionMode === 'measure' && startPoint && endPoint) {
        const scaleX = canvas.width / video.clientWidth;
        const scaleY = canvas.height / video.clientHeight;
        const s = { x: startPoint.x * scaleX, y: startPoint.y * scaleY };
        const e = { x: endPoint.x * scaleX, y: endPoint.y * scaleY };

        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(e.x, e.y);
        ctx.strokeStyle = 'yellow';
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';
        ctx.stroke();

        ctx.fillStyle = 'red';
        ctx.beginPath();
        ctx.arc(s.x, s.y, 8, 0, 2 * Math.PI);
        ctx.fill();

        ctx.fillStyle = 'blue';
        ctx.beginPath();
        ctx.arc(e.x, e.y, 8, 0, 2 * Math.PI);
        ctx.fill();
      }
    } catch (err) {
      console.error('Prediction error:', err);
    }

    requestPredictionFrame = requestAnimationFrame(predictWebcam);
  }, [streamActive, modelsReady, detectionMode, startPoint, endPoint]);

  useEffect(() => {
    setupModels();
  }, [setupModels]);

  useEffect(() => {
    if (modelsReady) startCamera();
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
      if (requestPredictionFrame) {
        cancelAnimationFrame(requestPredictionFrame);
        requestPredictionFrame = undefined;
      }
      if (videoRef.current) {
        videoRef.current.onloadedmetadata = null;
        videoRef.current.onerror = null;
      }
    };
  }, [facingMode, modelsReady, startCamera]);

  const flipCamera = useCallback(() => {
    if (requestPredictionFrame) {
      cancelAnimationFrame(requestPredictionFrame);
      requestPredictionFrame = undefined;
      console.log('🔄 Prediction loop stopped for camera flip.');
    }

    setFacingMode(prev => (prev === 'user' ? 'environment' : 'user'));
    setStartPoint(null);
    setEndPoint(null);
    setPixelDistance(0);
    setMeasureMode('calibrate');
    setPixelsPerUnit(null);
    setSavedMeasurements([]);
  }, []);

  const handleDrawStart = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (detectionMode !== 'measure') return;
    e.preventDefault();
    setIsDrawing(true);
    const point = getCoords(e, canvasRef.current);
    setStartPoint(point);
    setEndPoint(point);
    setPixelDistance(0);
  }, [detectionMode]);

  const handleDrawMove = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || detectionMode !== 'measure') return;
    e.preventDefault();
    const point = getCoords(e, canvasRef.current);
    setEndPoint(point);
  }, [isDrawing, detectionMode]);

  const handleDrawEnd = useCallback(() => {
    if (!isDrawing || !startPoint || !endPoint || detectionMode !== 'measure') return;
    setIsDrawing(false);

    const rect = canvasRef.current!.getBoundingClientRect();
    const scaleX = canvasRef.current!.width / rect.width;
    const scaleY = canvasRef.current!.height / rect.height;
    const dx = (endPoint.x - startPoint.x) * scaleX;
    const dy = (endPoint.y - startPoint.y) * scaleY;
    const dist = Math.sqrt(dx * dx + dy * dy);

    setPixelDistance(dist);
  }, [isDrawing, startPoint, endPoint, detectionMode]);

  const handleCalibrate = useCallback(() => {
    if (pixelDistance === 0) {
      setErrorMsg('Gambar garis pada objek referensi terlebih dahulu!');
      return;
    }
    const lengthInCm = parseFloat(knownLength);
    if (isNaN(lengthInCm) || lengthInCm <= 0) {
      setErrorMsg('Masukkan panjang referensi yang valid dalam cm.');
      return;
    }

    setPixelsPerUnit(pixelDistance / lengthInCm);
    setMeasureMode('measure');
    setErrorMsg('');
    setPixelDistance(0);
    setStartPoint(null);
    setEndPoint(null);
  }, [pixelDistance, knownLength]);

  const saveCurrentMeasurement = useCallback(() => {
    const value = convertDistance(pixelDistance, pixelsPerUnit, currentUnit);
    if (value > 0) setSavedMeasurements(prev => [value, ...prev.slice(0, 4)]);
    setPixelDistance(0);
    setStartPoint(null);
    setEndPoint(null);
  }, [pixelDistance, pixelsPerUnit, currentUnit]);

  const sendToCalculator = useCallback(
    (value: number) => {
      alert(`Mengirim ${value.toFixed(2)} ${currentUnit} ke Kalkulator (fitur belum aktif)`);
    },
    [currentUnit]
  );

  return {
    videoRef, canvasRef, errorMsg, streamActive, facingMode, modelsReady, loadingStatus,
    detectionMode, measureMode, pixelsPerUnit, knownLength, currentUnit, savedMeasurements,
    pixelDistance, startPoint, endPoint, detectedAge,
    flipCamera, setDetectionMode, setMeasureMode,
    setKnownLength, handleCalibrate, setCurrentUnit, saveCurrentMeasurement, sendToCalculator,
    handleDrawStart, handleDrawMove, handleDrawEnd, convertDistance
  };
}
