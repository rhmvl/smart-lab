import { Ruler, Hand, Smile, Hourglass, RefreshCw, Save, RotateCcw,} from "lucide-react";
import { useArLabLogic, type MeasurementUnit } from "./useArLabLogic";

export default function ArLab() {
  const isActive = location.pathname.includes("/smart-lab/ar-lab");
  const logic = useArLabLogic();

  if (!isActive) return null;
  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      {/* === CAMERA FEED === */}
      <video
        ref={logic.videoRef}
        className={[
          "w-full h-full object-cover",
          logic.facingMode === "user" && "scale-x-[-1]"
        ].join(' ')}
        autoPlay
        playsInline
        muted
      />

      <canvas
        ref={logic.canvasRef}
        className={[
          "absolute top-0 left-0 w-full h-full z-10 cursor-crosshair",
          logic.facingMode === "user" && "scale-x-[-1]"
        ].join(' ')}
        style={{
          pointerEvents: logic.detectionMode === "measure" ? "auto" : "none",
        }}
        onMouseDown={logic.handleDrawStart}
        onMouseMove={logic.handleDrawMove}
        onMouseUp={logic.handleDrawEnd}
        onTouchStart={logic.handleDrawStart}
        onTouchMove={logic.handleDrawMove}
        onTouchEnd={logic.handleDrawEnd}
      />

      {/* === CAMERA CONTROL === */}
      {logic.streamActive && (
        <button
          onClick={logic.flipCamera}
          className="
            absolute top-5 left-5 z-20
            px-4 py-2 rounded-lg
            bg-white/80 dark:bg-gray-800/80
            shadow-md
            font-semibold
            hover:bg-white dark:hover:bg-gray-700
            transition
          "
          title="Ganti Kamera"
        >
          <RefreshCw className="w-5 h-5 text-gray-700 dark:text-gray-200" />
        </button>
      )}

      {/* === ERROR MESSAGE === */}
      {logic.errorMsg && (
        <div className="
          absolute top-20 left-1/2 -translate-x-1/2 z-30
          bg-red-600 text-white px-6 py-3 rounded-lg shadow-lg
          text-center font-semibold w-4/5 max-w-md
        ">
          {logic.errorMsg}
        </div>
      )}

      {/* === LOADING OVERLAY === */}
      {!logic.modelsReady && !logic.errorMsg && (
        <div className="absolute inset-0 flex flex-col justify-center items-center bg-black/70 text-white z-20">
          <div className="w-14 h-14 border-8 border-gray-200 border-t-blue-500 rounded-full animate-spin mb-5"></div>
          <p>{logic.loadingStatus}</p>
        </div>
      )}

      {/* === MAIN UI PANEL === */}
      <div className="
        absolute bottom-0 left-0 w-full z-20
        bg-black/85 text-white
        p-4 flex flex-col
        max-h-[50%] overflow-y-auto
        rounded-t-2xl border-t border-white/10
        font-sans
      ">
        {/* === MODE SELECTOR === */}
        <div className="flex justify-around mb-4 border-b border-white/20 pb-3">
          <button
            onClick={() => logic.setDetectionMode("measure")}
            className={[
              "flex items-center gap-2 px-3 py-2 rounded-md transition-colors",
              logic.detectionMode === "measure"
                ? "text-blue-400 bg-blue-500/10 font-bold"
                : "text-gray-400 hover:text-white"
            ].join(' ')}
          >
            <Ruler className="w-4 h-4" /> Ukur
          </button>

          <button
            onClick={() => logic.setDetectionMode("hand")}
            className={[
              "flex items-center gap-2 px-3 py-2 rounded-md transition-colors",
              logic.detectionMode === "hand"
                ? "text-blue-400 bg-blue-500/10 font-bold"
                : "text-gray-400 hover:text-white"
            ].join(' ')}
          >
            <Hand className="w-4 h-4" /> Tangan
          </button>

          <button
            onClick={() => logic.setDetectionMode("face")}
            className={[
              "flex items-center gap-2 px-3 py-2 rounded-md transition-colors",
              logic.detectionMode === "face"
                ? "text-blue-400 bg-blue-500/10 font-bold"
                : "text-gray-400 hover:text-white"
            ].join(' ')}
          >
            <Smile className="w-4 h-4" /> Wajah
          </button>

          <button
            disabled
            title="Fitur Estimasi Umur Belum Tersedia"
            className="flex items-center gap-2 px-3 py-2 rounded-md text-gray-600 bg-gray-700/50 cursor-not-allowed"
          >
            <Hourglass className="w-4 h-4" /> Umur
          </button>
        </div>

        {/* === MEASUREMENT MODE === */}  
        <div className="flex flex-col">
          {logic.measureMode === "calibrate" ? (
            <div className="bg-white/5 p-4 rounded-xl mb-4">
              <h3 className="text-center font-semibold mb-2">Langkah 1: Kalibrasi</h3>
              <p className="text-center text-gray-300 text-sm mb-3">
                Gambar garis pada objek referensi.
              </p>

              <div className="flex items-center gap-2 mb-3">
                <label htmlFor="knownLengthInput" className="text-sm whitespace-nowrap">
                  Panjang Ref. (cm):
                </label>
                <input
                  id="knownLengthInput"
                  type="number"
                  className="flex-1 rounded-md bg-gray-800 text-white px-2 py-1 text-sm border border-gray-700"
                  value={logic.knownLength}
                  onChange={(e) => logic.setKnownLength(e.target.value)}
                />
              </div>

              <button
                onClick={logic.handleCalibrate}
                className="w-full flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-md transition"
              >
                <RotateCcw className="w-4 h-4" /> Kalibrasi
              </button>

              <p className="text-center text-gray-400 text-xs mt-2">
                Panjang di layar: {logic.pixelDistance.toFixed(0)} piksel
              </p>
            </div>
          ) : (
            <div className="bg-white/5 p-4 rounded-xl mb-4">
              <h3 className="text-center font-semibold mb-2">Langkah 2: Mengukur</h3>
              <p className="text-center text-gray-300 text-sm mb-3">
                Gambar garis pada objek untuk mengukur panjang.
              </p>

              <div className="flex items-center justify-center gap-2 text-yellow-300 text-2xl font-bold mb-3"> 
                {logic.pixelsPerUnit
                  ? logic.convertDistance(logic.pixelDistance, logic.pixelsPerUnit, logic.currentUnit).toFixed(1)
                  : '–'}
                <select
                  value={logic.currentUnit}
                  onChange={(e) =>
                    logic.setCurrentUnit(e.target.value as MeasurementUnit)
                  }
                  className="bg-gray-800 text-white text-sm rounded-md px-2 py-1 border border-gray-700"
                >
                  <option value="cm">cm</option>
                  <option value="mm">mm</option>
                  <option value="m">m</option>
                  <option value="inch">inch</option>
                  <option value="ft">ft</option>
                </select>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={logic.saveCurrentMeasurement}
                  disabled={logic.pixelDistance === 0}
                  className="flex-1 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 disabled:opacity-50 text-white font-semibold py-2 rounded-md transition"
                >
                  <Save className="w-4 h-4" /> Simpan
                </button>
                <button
                  onClick={() => logic.setMeasureMode("calibrate")}
                  className="flex-1 flex items-center justify-center gap-2 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 rounded-md transition"
                >
                  <RotateCcw className="w-4 h-4" /> Kalibrasi Ulang
                </button>
              </div>
            </div>
          )}

          {logic.savedMeasurements.length > 0 && (
            <div className="border-t border-white/20 pt-3 mt-2">
              <h4 className="text-center text-gray-300 text-sm font-medium mb-2">
                Ukuran Tersimpan
              </h4>
              <ul className="space-y-1 max-h-24 overflow-y-auto">
                {logic.savedMeasurements.map((m, i) => (
                  <li
                    key={i}
                    className="flex justify-between items-center bg-white/10 rounded-md px-3 py-2 text-sm"
                  >
                    <span>{m.value.toFixed(2)} {m.unit}</span>
                    <span className="text-gray-400 text-xs">
                      {new Date(m.timestamp).toLocaleTimeString()}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

