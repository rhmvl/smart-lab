import { Notebook, Cpu, Calculator, FlaskRound, FlaskConical } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import type { Dispatch, SetStateAction } from 'react';
import { WEBSITE_URL } from '../../utils/config';

interface NavbarProps {
  setNotesOpen: Dispatch<SetStateAction<boolean>>;
}

// TODO WELL, GK NGERTI DI APAKNO MANEH, DEMAKNO.

export default function Navbar({ setNotesOpen }: NavbarProps) {
  const location = useLocation();

  const links = [
    { name: 'Dashboard', path: `${WEBSITE_URL}`, icon: <FlaskConical className="w-4 h-4" /> },
    { name: 'AlgoWorks', path: `${WEBSITE_URL}/algo-works`, icon: <Cpu className="w-4 h-4" /> },
    { name: 'CalcForge', path: `${WEBSITE_URL}/calc-forge`, icon: <Calculator className="w-4 h-4" /> },
    { name: 'AR Lab', path: `${WEBSITE_URL}/ar-lab`, icon: <FlaskRound className="w-4 h-4" /> },
  ];

  return (
    <div className="fixed top-0 left-0 right-0 z-40 bg-white/60 dark:bg-gray-900/60 backdrop-blur-md border-b border-gray-200/30 dark:border-gray-700/30 shadow-md">
      <div className="flex items-center justify-between py-3 max-w-screen-xl mx-auto">
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
            const isActive = location.pathname === link.path;
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
          className="flex items-center space-x-2 bg-gradient-to-r from-indigo-500 to-pink-500 text-white px-4 py-2 rounded-full font-semibold shadow-md hover:from-indigo-600 hover:to-pink-600 transition-all cursor-pointer
"
        >
          <Notebook className="w-5 h-5" />
          <span className="hidden sm:inline">Notes</span>
        </button>
      </div>
    </div>
  );
}

