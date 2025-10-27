import { Notebook, Cpu, Calculator, FlaskRound, FlaskConical } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { WEBSITE_URL } from "../../utils/config";

interface NavbarProps {
  setNotesOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Navbar({ setNotesOpen }: NavbarProps) {
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const shouldBeVisible = location.pathname !== WEBSITE_URL;
    setIsVisible(shouldBeVisible);
  }, [location.pathname]);

  const links = [
    { name: "Dashboard", path: WEBSITE_URL, icon: <FlaskConical className="w-4 h-4" /> },
    { name: "AlgoWorks", path: `${WEBSITE_URL}/algo-works`, icon: <Cpu className="w-4 h-4" /> },
    { name: "CalcForge", path: `${WEBSITE_URL}/calc-forge`, icon: <Calculator className="w-4 h-4" /> },
    { name: "AR Lab", path: `${WEBSITE_URL}/ar-lab`, icon: <FlaskRound className="w-4 h-4" /> },
  ];

  return (
    <div
      className={[
        "fixed top-4 left-1/2 -translate-x-1/2 z-40",
        "px-4 sm:px-6 py-3 rounded-xl",
        "backdrop-blur-md border shadow-lg",
        "bg-white/60 border-gray-200/30 dark:bg-gray-900/60 dark:border-gray-700/30",
        "max-w-screen-lg w-[90%]",
        "transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]",
        isVisible
          ? "opacity-100 visible translate-y-0"
          : "opacity-0 invisible -translate-y-20",
      ].join(" ")}
    >
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
        {/* === Logo === */}
        <Link
          to={WEBSITE_URL}
          className="flex items-center gap-2 hover:opacity-90 transition-opacity shrink-0"
        >
          <span className="text-xl md:text-2xl font-extrabold text-gray-900 dark:text-white leading-none">
            Smart Lab
          </span>
        </Link>

        {/* === Navigation Links === */}
        <nav className="flex flex-wrap items-center gap-4 sm:gap-6 md:gap-8 flex-1 justify-center">
          {links.map((link) => {
            const isActive =
              location.pathname === link.path ||
              (link.path !== WEBSITE_URL && location.pathname.startsWith(link.path));

            return (
              <Link
                key={link.name}
                to={link.path}
                className={[
                  "flex items-center gap-2 text-sm font-semibold transition-all duration-200 whitespace-nowrap",
                  isActive
                    ? "text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-500 pb-1"
                    : "text-gray-700 dark:text-gray-300 hover:text-indigo-500 dark:hover:text-indigo-400",
                ].join(" ")}
              >
                {link.icon}
                <span>{link.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* === Notes Button === */}
        <button
          onClick={() => setNotesOpen(true)}
          className="flex items-center gap-2 px-4 py-2 font-semibold text-white rounded-full shadow-md cursor-pointer 
                     bg-gradient-to-r from-indigo-500 to-pink-500 
                     hover:from-indigo-600 hover:to-pink-600 
                     transition-all active:scale-[0.97] shrink-0"
        >
          <Notebook className="w-5 h-5" />
          <span className="hidden sm:inline">Notes</span>
        </button>
      </div>
    </div>
  );
}

