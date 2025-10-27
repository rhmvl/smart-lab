import { Notebook, Cpu, Calculator, FlaskRound, FlaskConical } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { WEBSITE_URL } from "../../utils/config";

interface NavbarProps {
  setNotesOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

// TODO: FIX THIS NAVBAR SO THAT IT DOESNT OVERLAP WITH OTHER FEATURES
// TODO: TRANSITION BETWEEN PAGES

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
        "max-w-[130vw] lg:max-w-screen-lg",
        "transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]",
        isVisible
          ? "opacity-100 visible translate-y-0"
          : "opacity-0 invisible -translate-y-20",
      ].join(" ")}
    >
      {/* Inner container */}
      <div className="flex items-center justify-between max-w-screen-xl mx-auto">
        {/* === Logo === */}
        <Link
          to={WEBSITE_URL}
          className="flex items-center gap-2 hover:opacity-90 transition-opacity mr-14"
        >
          <span className="text-xl md:text-2xl font-extrabold text-gray-900 dark:text-white">
            Smart Lab
          </span>
        </Link>

        {/* === Navigation Links === */}
        <nav className="hidden md:flex items-center gap-8">
          {links.map((link) => {
            const isActive =
              location.pathname === link.path ||
              (link.path !== WEBSITE_URL && location.pathname.startsWith(link.path));

            return (
              <Link
                key={link.name}
                to={link.path}
                className={[
                  "flex items-center gap-2 text-sm font-semibold transition-all duration-200",
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
          className="flex items-center gap-2 px-4 py-2 ml-14 font-semibold text-white rounded-full shadow-md cursor-pointer 
                     bg-gradient-to-r from-indigo-500 to-pink-500 
                     hover:from-indigo-600 hover:to-pink-600 
                     transition-all active:scale-[0.97]"
        >
          <Notebook className="w-5 h-5" />
          <span className="hidden sm:inline">Notes</span>
        </button>
      </div>
    </div>
  );
}
