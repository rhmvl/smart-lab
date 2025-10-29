interface FeatureViewProps {
  title: string;
  description: string;
  bgColor?: string;
  icon?: React.ReactNode;
  footer?: string;
}

export const FeatureView = ({
  title,
  description,
  bgColor = "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500",
  icon,
  footer = `© ${new Date().getFullYear()} Smart Lab`,
}: FeatureViewProps) => {
  return (
    <div className="flex items-center justify-center w-full min-h-screen px-6 py-12 text-center">
      <div
        className={`
          ${bgColor} text-white p-10 rounded-2xl shadow-2xl 
          max-w-md w-full animate-[var(--animate-gradient)]
          backdrop-blur-lg border border-white/20
        `}
      >
        {icon && (
          <div className="flex items-center justify-center w-20 h-20 mb-6 bg-white/20 rounded-full animate-bounce">
            {icon}
          </div>
        )}

        <h1 className="text-3xl font-extrabold mb-3">{title}</h1>
        <p className="text-sm sm:text-base opacity-90 mb-8">{description}</p>
        <p className="text-xs opacity-70">{footer}</p>
      </div>
    </div>
  );
};


