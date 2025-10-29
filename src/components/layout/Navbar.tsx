import { Notebook, Menu, X, type LucideIcon, FlaskConicalIcon, Settings } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { WEBSITE_URL, WEB_PAGE } from "../../utils/config";

interface NavbarProps {
  toggleNotesOpen: () => void;
  changeFeature: (featurePath: string, icon: LucideIcon, color: string) => void;
  setSettingsOpen: (isOpen: boolean) => void; 
}

export default function Navbar({ toggleNotesOpen, changeFeature, setSettingsOpen }: NavbarProps) {
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(false);
  const [navVisible, setNavVisible] = useState(true);
  
  useEffect(() => {
    const normalizePath = (path: string) =>
      path.replace(/\/+$/, "").replace(/\/{2,}/g, "/"); // remove trailing + duplicate slashes

    const normalizedCurrent = normalizePath(location.pathname);
    const normalizedHome = normalizePath(WEBSITE_URL);

    const shouldBeVisible = normalizedCurrent !== normalizedHome;
    setIsVisible(shouldBeVisible);
  }, [location.pathname]);


  return (
    <>
      {/* === Navbar === */}
      <div
        className={[
          "fixed top-4 left-1/2 -translate-x-1/2 z-40",
          "px-4 sm:px-6 py-3 rounded-xl",
          "backdrop-blur-md border shadow-lg",
          "bg-white/60 border-gray-200/30 dark:bg-gray-900/60 dark:border-gray-700/30",
          "max-w-screen-lg w-[90%]",
          "transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]",
          isVisible && navVisible
            ? "opacity-100 visible translate-y-0"
            : "opacity-0 invisible -translate-y-20 pointer-events-none",
        ].join(" ")}
      >
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
          {/* === Logo === */}
          <button
            onClick={() => changeFeature("", Notebook, "#6366f1")}
            className="flex items-center gap-2 hover:opacity-90 transition-opacity shrink-0"
          >
            <span className="text-xl md:text-2xl font-extrabold text-gray-900 dark:text-white leading-none">
              Smart Lab
            </span>
          </button>

          {/* === Navigation Links === */}
          <nav className="flex flex-wrap items-center gap-4 sm:gap-6 md:gap-8 flex-1 justify-center">
            <button
              onClick={() => changeFeature(`..${WEBSITE_URL}`, FlaskConicalIcon, "#6366F1")}
              className="flex items-center gap-2 text-sm font-semibold transition-all duration-200 whitespace-nowrap
                         text-gray-700 dark:text-gray-300 hover:text-indigo-500 dark:hover:text-indigo-400"
            >
              <FlaskConicalIcon className="w-4 h-4" />
              <span>Dashboard</span>
            </button>

            {WEB_PAGE.map((page) => {
              const isActive =
                location.pathname === page.path ||
                (page.path !== WEBSITE_URL && location.pathname.startsWith(page.path));

              const Icon = page.icon;

              return (
                <button
                  key={page.id}
                  onClick={() => changeFeature(page.id, Icon, page.color)}
                  className={[
                    "flex items-center gap-2 text-sm font-semibold transition-all duration-200 whitespace-nowrap",
                    isActive
                      ? "text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-500 pb-1"
                      : "text-gray-700 dark:text-gray-300 hover:text-indigo-500 dark:hover:text-indigo-400",
                  ].join(" ")}
                >
                  <Icon className="w-4 h-4" />
                  <span>{page.title}</span>
                </button>
              );
            })}
          </nav>

          {/* === Right-side Controls === */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Notes Button */}
            <button
              onClick={toggleNotesOpen}
              className="flex items-center gap-2 px-4 py-2 font-semibold text-white rounded-full shadow-md cursor-pointer 
                         bg-gradient-to-r from-indigo-500 to-pink-500 
                         hover:from-indigo-600 hover:to-pink-600 
                         transition-all active:scale-[0.97]"
            >
              <Notebook className="w-5 h-5" />
              <span className="hidden sm:inline">Notes</span>
            </button>

            {/* Settings Button (new) */}
            <button
              onClick={() => setSettingsOpen(true)}
              title="Settings"
              className="
                flex h-10 w-10 items-center justify-center
                rounded-full border text-gray-800 dark:text-gray-200
                border-gray-300/40 dark:border-gray-700/50
                bg-white/40 dark:bg-gray-800/40
                shadow-sm backdrop-blur-sm
                hover:scale-110 hover:rotate-6 hover:bg-white/60 hover:dark:bg-gray-700/60
                transition-all duration-200 active:scale-95
              "
            >
              <Settings size={18} />
            </button>

            {/* Hide Navbar Button */}
            <button
              onClick={() => setNavVisible(false)}
              className="p-2 rounded-md bg-white/70 dark:bg-gray-800/70 border border-gray-300/30 dark:border-gray-700/30 
                         hover:bg-white/90 dark:hover:bg-gray-800/90 transition-all"
              aria-label="Hide Navbar"
            >
              <X className="w-5 h-5 text-gray-800 dark:text-gray-200" />
            </button>
          </div>
        </div>
      </div>

      {/* === Floating Reopen Button === */}
      {!navVisible && (
        <button
          onClick={() => setNavVisible(true)}
          className="fixed top-4 right-4 z-50 p-2 rounded-md shadow-md 
                     bg-gradient-to-r from-indigo-500 to-pink-500 text-white
                     hover:from-indigo-600 hover:to-pink-600
                     transition-all active:scale-95"
          aria-label="Show Navbar"
        >
          <Menu className="w-5 h-5" />
        </button>
      )}
    </>
  );
}
