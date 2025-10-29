type Point = { x: number; y: number };
type MeasurementUnit = 'cm' | 'mm' | 'm' | 'inch' | 'ft';

// === HAND CONNECTIONS (Based on MediaPipe Landmarks) ===
const HAND_CONNECTIONS: [number, number][] = [
  [0, 1], [1, 2], [2, 3], [3, 4],         // Thumb
  [0, 5], [5, 6], [6, 7], [7, 8],         // Index Finger
  [0, 9], [9, 10], [10, 11], [11, 12],    // Middle Finger
  [0, 13], [13, 14], [14, 15], [15, 16],  // Ring Finger
  [0, 17], [17, 18], [18, 19], [19, 20],  // Pinky Finger
  [5, 9], [9, 13], [13, 17], [17, 5]      // Palm Loop
];

export const getCoords = (
  e: React.MouseEvent | React.TouchEvent,
  canvasElement: HTMLCanvasElement | null
): Point => {
  if (!canvasElement) return { x: 0, y: 0 };

  const rect = canvasElement.getBoundingClientRect();
  let clientX = 0;
  let clientY = 0;

  if ('touches' in e && e.touches.length > 0) {
    clientX = e.touches[0].clientX;
    clientY = e.touches[0].clientY;
  } else if ('clientX' in e) {
    clientX = e.clientX;
    clientY = e.clientY;
  }

  return {
    x: clientX - rect.left,
    y: clientY - rect.top
  };
};

export const drawHandLandmarks = (
  ctx: CanvasRenderingContext2D,
  landmarks: Array<Array<{ x: number; y: number }>> | undefined,
  width: number,
  height: number
): void => {
  if (!landmarks?.length) return;

  for (const hand of landmarks) {
    if (!Array.isArray(hand) || hand.length !== 21) continue;

    // --- 1. Draw Hand Connections (Green) ---
    ctx.strokeStyle = 'lime';
    ctx.lineWidth = 3;

    for (const [startIdx, endIdx] of HAND_CONNECTIONS) {
      const start = hand[startIdx];
      const end = hand[endIdx];

      if (!start || !end) continue;

      ctx.beginPath();
      ctx.moveTo(start.x * width, start.y * height);
      ctx.lineTo(end.x * width, end.y * height);
      ctx.stroke();
    }

    // --- 2. Draw Joint Points (Aqua) ---
    ctx.fillStyle = 'aqua';
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 1;

    for (const point of hand) {
      if (typeof point.x !== 'number' || typeof point.y !== 'number') continue;

      const x = point.x * width;
      const y = point.y * height;

      ctx.beginPath();
      ctx.arc(x, y, 5, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();
    }
  }
};

export const drawFaceDetections = (
  ctx: CanvasRenderingContext2D,
  detections: Array<{ boundingBox: { originX: number; originY: number; width: number; height: number } }> | undefined
): void => {
  if (!detections?.length) return;

  ctx.strokeStyle = 'lime';
  ctx.lineWidth = 3;
  ctx.fillStyle = 'rgba(0, 255, 0, 0.1)';

  for (const { boundingBox: bbox } of detections) {
    if (!bbox || typeof bbox.originX !== 'number') continue;

    ctx.beginPath();
    ctx.rect(bbox.originX, bbox.originY, bbox.width, bbox.height);
    ctx.stroke();
    ctx.fill();
  }
};

export const convertDistance = (
  pixels: number,
  pixelsPerUnit: number | null,
  currentUnit: MeasurementUnit
): number => {
  if (!pixelsPerUnit || pixels === 0) return 0;

  const distanceInCm = pixels / pixelsPerUnit;

  switch (currentUnit) {
    case 'mm':   return distanceInCm * 10;
    case 'm':    return distanceInCm / 100;
    case 'inch': return distanceInCm / 2.54;
    case 'ft':   return distanceInCm / 30.48;
    case 'cm':
    default:     return distanceInCm;
  }
};

