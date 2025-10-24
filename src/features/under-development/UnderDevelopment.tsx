export const UnderDevelopment = ({
  featureName = "This feature",
}: {featureName: string}) => {
  return (
    <div className="flex items-center justify-center min-h-screen px-6 py-12 animated-background">
      <div className="
          flex flex-col items-center text-center 
          p-8 sm:p-10 rounded-xl shadow-lg
          bg-white dark:bg-gray-800/60 
          border border-gray-200 dark:border-gray-700
          max-w-md w-full
        ">
        {/* Icon */}
        <div className="flex items-center justify-center w-20 h-20 mb-6 bg-indigo-100 dark:bg-indigo-800/30 text-indigo-600 dark:text-indigo-400 rounded-full animate-bounce">
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
              d="M10.5 6.75a7.5 7.5 0 1 0 6.75 6.75M12 2.25v1.5m0 16.5v1.5m9-9h-1.5M4.5 12H3m15.364 6.364l-1.06-1.06M6.697 6.697l-1.06-1.06m12.728 0l-1.06 1.06M6.697 17.303l-1.06 1.06"
            />
          </svg>
        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800 dark:text-gray-100">
          {featureName} is under development
        </h1>

        {/* Subtitle */}
        <p className="mt-3 text-gray-600 dark:text-gray-400 max-w-md text-sm sm:text-base">
          We’re still working on this part of the app. Please check back soon
        </p>

        {/* Optional actions */}
        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => window.history.back()}
            className="px-5 py-2.5 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition"
          >
            Go Back
          </button>
          <a
            href="/"
            className="px-5 py-2.5 rounded-md border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            Return Home
          </a>
        </div>

        {/* Footer note */}
        <p className="mt-10 text-xs text-gray-400 dark:text-gray-500">
          © {new Date().getFullYear()} Smart Lab
        </p>
      </div>
    </div>
  );
};
