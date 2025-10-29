export const DesktopOnlyNotice = () => {
  return (
    <div className="flex items-center justify-center min-h-screen px-6 py-12 bg-gray-50 dark:bg-gray-950">
      <div
        className="
          flex flex-col items-center text-center
          p-8 sm:p-10 rounded-xl shadow-lg
          bg-white dark:bg-gray-800/60
          border border-gray-200 dark:border-gray-700
          max-w-md w-full transition-colors duration-300
        "
      >
        {/* Icon */}
        <div className="flex items-center justify-center w-20 h-20 mb-6 bg-blue-100 dark:bg-blue-800/30 text-blue-600 dark:text-blue-400 rounded-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-10 h-10"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.8}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 21h6m2 0h1a2 2 0 0 0 2-2v-5a9 9 0 1 0-18 0v5a2 2 0 0 0 2 2h1"
            />
          </svg>
        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800 dark:text-gray-100">
          Desktop Experience Only
        </h1>

        {/* Subtitle */}
        <p className="mt-3 text-gray-600 dark:text-gray-400 max-w-md text-sm sm:text-base leading-relaxed">
          This website is optimized for desktop use.
          <br className="hidden sm:block" />
          We’re currently working on a smooth, fully featured mobile version.
        </p>

        {/* Small note */}
        <p className="mt-8 text-xs text-gray-400 dark:text-gray-500">
          Please visit again from your desktop or laptop for the best experience.
        </p>

        {/* Footer */}
        <p className="mt-10 text-xs text-gray-400 dark:text-gray-500">
          © {new Date().getFullYear()} Smart Lab
        </p>
      </div>
    </div>
  );
};

