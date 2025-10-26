import { Notebook, Cpu, Calculator, FlaskRound, FlaskConical } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import type { Dispatch, SetStateAction } from 'react';
import { useState, useEffect } from 'react';
import { WEBSITE_URL } from '../../utils/config';

interface NavbarProps {
  setNotesOpen: Dispatch<SetStateAction<boolean>>;
}

export default function Navbar({ setNotesOpen }: NavbarProps) {
  const location = useLocation();
  // State untuk visibilitas, default false agar animasi bisa jalan saat true
  const [isVisible, setIsVisible] = useState(false); 

  // Logika untuk menampilkan/menyembunyikan Navbar
  useEffect(() => {
    // Tentukan apakah harus visible (bukan di dashboard utama)
    const shouldBeVisible = location.pathname !== WEBSITE_URL;
    setIsVisible(shouldBeVisible);
    // console.log("Navbar should be visible:", shouldBeVisible, "Path:", location.pathname); // Optional: for debugging
  }, [location.pathname]); // Update saat path berubah

  const links = [
    { name: 'Dashboard', path: `${WEBSITE_URL}`, icon: <FlaskConical className="w-4 h-4" /> },
    { name: 'AlgoWorks', path: `${WEBSITE_URL}/algo-works`, icon: <Cpu className="w-4 h-4" /> },
    { name: 'CalcForge', path: `${WEBSITE_URL}/calc-forge`, icon: <Calculator className="w-4 h-4" /> },
    { name: 'AR Lab', path: `${WEBSITE_URL}/ar-lab`, icon: <FlaskRound className="w-4 h-4" /> },
  ];

  return (
    // Terapkan kelas 'visible' atau 'hidden' berdasarkan state
    // Kelas 'navbar' tetap ada untuk style dasar
    <div className={`navbar ${isVisible ? 'navbar-visible' : 'navbar-hidden'}`}>
      <div className="flex items-center justify-between py-3 max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8"> {/* Tambah padding horizontal */}
        {/* LOGO */}
        <Link
          to={WEBSITE_URL}
          className="flex items-center space-x-2 group hover:opacity-90 transition-opacity"
        >
          <span className="text-xl md:text-2xl font-extrabold text-gray-800 dark:text-white">
            Smart Lab
          </span>
        </Link>

        {/* NAV LINKS */}
        <nav className="hidden md:flex items-center space-x-8">
          {links.map((link) => {
            // Logika isActive disederhanakan
            const isActive = location.pathname === link.path || (link.path !== WEBSITE_URL && location.pathname.startsWith(link.path));
            return (
              <Link
                key={link.name}
                to={link.path}
                className={`flex items-center space-x-2 text-sm font-semibold transition-all ${
                  isActive
                    ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-500 pb-1'
                    : 'text-gray-700 dark:text-gray-300 hover:text-indigo-500 dark:hover:text-indigo-400'
                }`}
              >
                {link.icon}
                <span>{link.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* NOTES BUTTON */}
        <button
          onClick={() => setNotesOpen(true)}
          className="notes-button" // Gunakan kelas dari CSS Anda
        >
          <Notebook className="w-5 h-5" />
          <span className="hidden sm:inline">Notes</span>
        </button>
      </div>
    </div>
  );
}
//
//import { Notebook, Cpu, Calculator, FlaskRound, FlaskConical } from 'lucide-react';
//import { Link, useLocation } from 'react-router-dom';
//import type { Dispatch, SetStateAction } from 'react';
//import { WEBSITE_URL } from '../../utils/config';
//import { useState, useEffect } from 'react'; // Impor useState dan useEffect
//
//interface NavbarProps {
//  setNotesOpen: Dispatch<SetStateAction<boolean>>;
//}
//
//// TODO WELL, GK NGERTI DI APAKNO MANEH, DEMAKNO.
//
//export default function Navbar({ setNotesOpen }: NavbarProps) {
//  const location = useLocation();
//  // State untuk visibilitas, defaultnya false agar animasi bisa jalan saat true
//  const [isVisible, setIsVisible] = useState(false); 
//  // Logika untuk menampilkan/menyembunyikan
//  useEffect(() => {
//    // Tampilkan jika pathname BUKAN dashboard utama
//    const shouldBeVisible = location.pathname !== WEBSITE_URL;
//    setIsVisible(shouldBeVisible);
//    console.log("Navbar should be visible:", shouldBeVisible, "Path:", location.pathname, "Dashboard Path:", WEBSITE_URL); // Tambahkan log
//  }, [location.pathname]); // Update saat path berubah
//
//  const links = [
//    { name: 'Dashboard', path: `${WEBSITE_URL}`, icon: <FlaskConical className="w-4 h-4" /> },
//    { name: 'AlgoWorks', path: `${WEBSITE_URL}/algo-works`, icon: <Cpu className="w-4 h-4" /> },
//    { name: 'CalcForge', path: `${WEBSITE_URL}/calc-forge`, icon: <Calculator className="w-4 h-4" /> },
//    { name: 'AR Lab', path: `${WEBSITE_URL}/ar-lab`, icon: <FlaskRound className="w-4 h-4" /> },
//  ];
//
//  return (
//    <div className="navbar">
//      <div className="flex items-center justify-between py-3 max-w-screen-xl mx-auto">
//        {/* LOGO */}
//        <Link
//          to={WEBSITE_URL}
//          className="flex items-center space-x-2 group hover:opacity-90 transition-opacity"
//        >
//          <span className="text-xl md:text-2xl font-extrabold text-gray-800 dark:text-white">
//            Smart Lab
//          </span>
//        </Link>
//
//        {/* NAV LINKS */}
//        <nav className="hidden md:flex items-center space-x-8">
//          {links.map((link) => {
//            const isActive = link.path === links[0].path
//              ? location.pathname === links[0].path // exact match for home
//              : location.pathname.startsWith(link.path + '/')
//                || location.pathname === link.path;
//            return (
//              <Link
//                key={link.name}
//                to={link.path}
//                className={`flex items-center space-x-2 text-sm font-semibold transition-all ${
//                  isActive
//                    ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-500 pb-1'
//                    : 'text-gray-700 dark:text-gray-300 hover:text-indigo-500 dark:hover:text-indigo-400'
//                }`}
//              >
//                {link.icon}
//                <span>{link.name}</span>
//              </Link>
//            );
//          })}
//        </nav>
//
//        {/* NOTES BUTTON */}
//        <button
//          onClick={() => setNotesOpen(true)}
//          className="notes-button"
//        >
//          <Notebook className="w-5 h-5" />
//          <span className="hidden sm:inline">Notes</span>
//        </button>
//      </div>
//    </div>
//  );
//}
//
//