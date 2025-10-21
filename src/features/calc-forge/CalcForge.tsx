import { useState } from 'react';
import { hitungVolumeBalok } from './calculatorLogic'; // Import logika

export default function CalcForge() {
  const [panjang, setPanjang] = useState(0);
  const [lebar, setLebar] = useState(0);
  const [tinggi, setTinggi] = useState(0);
  const [volume, setVolume] = useState(0);

  const handleHitungClick = () => {
    const hasilVolume = hitungVolumeBalok(panjang, lebar, tinggi);
    setVolume(hasilVolume);
  };

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2>Kalkulator Volume Balok</h2>
      <div>
        <label>Panjang (m): </label>
        <input type="number" onChange={(e) => setPanjang(parseFloat(e.target.value))} />
      </div>
      <div>
        <label>Lebar (m): </label>
        <input type="number" onChange={(e) => setLebar(parseFloat(e.target.value))} />
      </div>
      <div>
        <label>Tinggi (m): </label>
        <input type="number" onChange={(e) => setTinggi(parseFloat(e.target.value))} />
      </div>
      <button onClick={handleHitungClick} style={{ marginTop: '10px' }}>Hitung</button>
      <h3>Hasil Volume: {volume} m³</h3>
    </div>
  );
}
