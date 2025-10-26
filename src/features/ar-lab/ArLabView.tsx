// src/features/ar-lab/ArLabView.tsx
import React from 'react';
import { useArLabLogic } from './useArLabLogic'; // Impor hook
import './ArMeasure.css'; // Impor CSS Anda
import type { MeasurementUnit } from './types'; // Impor tipe

export default function ArLabView() {
    // Panggil hook untuk mendapatkan semua state dan fungsi
    const logic = useArLabLogic();

    return (
        <div className="camera-container">
            {/* Video dan Canvas menggunakan ref dari hook */}
            <video ref={logic.videoRef} className="camera-feed" autoPlay playsInline muted></video>
            <canvas ref={logic.canvasRef} className="drawing-canvas"
                style={{ pointerEvents: logic.detectionMode === 'measure' ? 'auto' : 'none' }}
                // Pasang event handler dari hook
                onMouseDown={logic.handleDrawStart} onMouseMove={logic.handleDrawMove} onMouseUp={logic.handleDrawEnd}
                onTouchStart={logic.handleDrawStart} onTouchMove={logic.handleDrawMove} onTouchEnd={logic.handleDrawEnd}
            ></canvas>

            {/* Tombol Balik Kamera */}
            {logic.streamActive && ( <button className="flip-camera-btn" onClick={logic.flipCamera}>🔄</button> )}
            {logic.errorMsg && <div className="error-popup">{logic.errorMsg}</div>}
            {!logic.modelsReady && !logic.errorMsg && (
                <div className="start-overlay">
                    <div className="loading-spinner"></div>
                    <p>{logic.loadingStatus}</p>
                </div>
            )}

            {/* Panel UI Utama */}
            <div className="main-ui-panel">
                {/* Tombol Pindah Mode */}
                <div className="mode-selector">
                    <button onClick={() => logic.setDetectionMode('measure')} className={logic.detectionMode === 'measure' ? 'active' : ''}>📏 Ukur</button>
                    <button onClick={() => logic.setDetectionMode('hand')} className={logic.detectionMode === 'hand' ? 'active' : ''}>🖐️ Tangan</button>
                    <button onClick={() => logic.setDetectionMode('face')} className={logic.detectionMode === 'face' ? 'active' : ''}>😀 Wajah</button>
                    <button disabled title="Fitur Estimasi Umur Belum Tersedia">⏳ Umur</button>
                </div>

                {/* UI Pengukuran */}
                {logic.detectionMode === 'measure' && (
                    <div className="measurement-section">
                        {logic.measureMode === 'calibrate' ? (
                            <div className="calibrate-box">
                                <div className="measurement-title">Langkah 1: Kalibrasi</div>
                                <p>Gambar garis pada objek referensi.</p>
                                <div className="input-group">
                                    <label htmlFor="knownLengthInput">Panjang Ref. (cm):</label>
                                    <input
                                        id="knownLengthInput" type="number" value={logic.knownLength}
                                        onChange={(e) => logic.setKnownLength(e.target.value)}
                                    />
                                </div>
                                <button className="calibrate-btn" onClick={logic.handleCalibrate}>Kalibrasi</button>
                                <p className="distance-readout">Panjang di layar: {logic.pixelDistance.toFixed(0)} piksel</p>
                            </div>
                        ) : (
                            <div className="measure-box">
                                <div className="measurement-title">Langkah 2: Mengukur</div>
                                <p>Gambar garis pada objek.</p>
                                <div className="measurement-result">
                                    {logic.convertDistance(logic.pixelDistance).toFixed(1)}
                                    <select value={logic.currentUnit} onChange={(e) => logic.setCurrentUnit(e.target.value as MeasurementUnit)}>
                                        <option value="cm">cm</option>
                                        <option value="mm">mm</option>
                                        <option value="m">m</option>
                                        <option value="inch">inch</option>
                                        <option value="ft">ft</option>
                                    </select>
                                </div>
                                <button onClick={logic.saveCurrentMeasurement} disabled={logic.pixelDistance === 0}>Simpan Ukuran</button>
                                <button className="calibrate-btn" onClick={() => {
                                    logic.setMeasureMode('calibrate');
                                    // Panggil fungsi reset lain jika perlu
                                }}>Kalibrasi Ulang</button>
                            </div>
                        )}
                        {/* Daftar Ukuran Tersimpan */}
                        {logic.savedMeasurements.length > 0 && (
                            <div className="saved-measurements">
                                <h4>Ukuran Tersimpan:</h4>
                                <ul> {logic.savedMeasurements.map((m, i) => ( <li key={i}> {/* ... */} </li> ))} </ul>
                            </div>
                        )}
                    </div>
                )}
                {/* Placeholder Mode Lain */}
                {logic.detectionMode === 'hand' && <p>Arahkan kamera ke tangan Anda.</p>}
                {logic.detectionMode === 'face' && <p>Arahkan kamera ke wajah Anda.</p>}
            </div>
        </div>
    );
}
