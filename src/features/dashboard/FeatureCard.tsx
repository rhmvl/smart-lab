import { useRef, Suspense, type CSSProperties } from 'react';
import type { LucideIcon } from 'lucide-react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Box, Cylinder, Octahedron, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

// Interface props (tetap sama)
interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  color: string;
  onClick: () => void;
  style?: CSSProperties;
  className?: string;
}

// --- Komponen Internal 3D ---

// 1. Objek 3D yang berputar
function SpinningMesh({ shape, color }: { shape: string, color: string }) {
  const meshRef = useRef<THREE.Mesh>(null!);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.1;
      meshRef.current.rotation.y += delta * 0.2;
    }
  });

  // Pilih bentuk berdasarkan prop 'shape'
  const geometry = () => {
    switch (shape) {
      case 'Algo Works':
        return <boxGeometry args={[1.8, 1.8, 1.8]} />; // Kubus untuk Algo Works
      case 'Calc Forge':
        return <octahedronGeometry args={[1.2]} />; // Kristal/Octahedron untuk Calc Forge
      case 'AR Lab':
        return <cylinderGeometry args={[0.8, 0.8, 2, 16]} />; // Silinder/Tabung untuk AR Lab
      default:
        return <boxGeometry args={[1.5, 1.5, 1.5]} />;
    }
  };

  return (
    <mesh ref={meshRef}>
    {geometry()}
    <meshStandardMaterial color={color} roughness={0.3} metalness={0.7} />
    </mesh>
  );
}

// 2. Komponen Kanvas 3D
function Icon3D({ title, color }: { title: string, color: string }) {
  return (
    <Canvas camera={{ position: [0, 0, 3.5], fov: 45 }}>
    {/* Pencahayaan lembut dari semua sisi */}
    <ambientLight intensity={1.5} />
    {/* Cahaya utama dari atas */}
    <directionalLight position={[5, 5, 5]} intensity={2} color="white" />
    {/* Cahaya pengisi dari bawah/belakang */}
    <pointLight position={[-5, -5, -5]} intensity={0.5} color="#ffffff" />

    {/* Gunakan Suspense untuk fallback jika model 3D berat */}
    <Suspense fallback={null}>
    <SpinningMesh shape={title} color={color} />
    </Suspense>

    {/* Opsional: Izinkan pengguna memutar ikon 3D dengan mouse */}
    {/* <OrbitControls enableZoom={false} enablePan={false} /> */}
    </Canvas>
  );
}

// --- Komponen FeatureCard Utama ---

export default function FeatureCard({
  icon: Icon, // Simpan prop ikon 2D (mungkin untuk fallback)
title,
description,
color,
onClick,
style = {},
className = '', // Terima kelas dari Dashboard
}: FeatureCardProps) {

  // Gabungkan kelas
  const combinedClassName = `group absolute ${className} w-[180px] min-h-[220px] p-5
  bg-white/90 dark:bg-gray-800/80 backdrop-blur-sm
  border border-white/20 dark:border-gray-700/30
  rounded-2xl shadow-lg cursor-pointer
  flex flex-col items-center justify-start pt-6 text-center
  text-gray-800 dark:text-gray-100
  transition-all duration-300 ease-in-out
  hover:scale-105 hover:-translate-y-3
  hover:shadow-[0_16px_40px_rgba(0,0,0,0.15),0_0_20px_var(--glow-color)]`;

  return (
    <div
    onClick={onClick}
    style={{
      ...style,
      '--glow-color': color,
      willChange: style.willChange,
      animation: style.animation,
      animationDelay: style.animationDelay,
    } as CSSProperties}
    className={combinedClassName}
    >
    {/* Wrapper untuk konten (diperlukan untuk counter-spin jika ada) */}
    <div className="card-content-wrapper flex flex-col items-center justify-center">

    {/* === KANVAS 3D MENGGANTIKAN IKON === */}
    <div className="mb-2 w-24 h-24"> {/* Beri ukuran lebih besar untuk 3D */}
    <Icon3D title={title} color={color} />
    </div>
    {/* ================================== */}

    {/* Judul */}
    <h3 className="text-lg font-bold">
    {title}
    </h3>
    </div>

    {/* Deskripsi (muncul saat hover) */}
    <div className={`absolute bottom-[-10px] left-1/2 -translate-x-1/2 w-[90%]
      bg-gray-700 dark:bg-gray-600 text-white dark:text-gray-200
      text-xs rounded-lg px-2 py-1 shadow-md
      opacity-0 invisible group-hover:visible group-hover:opacity-100
      group-hover:bottom-[-35px] transition-all duration-300 ease-in-out
      pointer-events-none`}>
      <p className="m-0">{description}</p>
      </div>
      </div>
  );
}
