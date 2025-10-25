interface FeatureIcon {
  url: string;
  name: string;
}

export interface FeatureIcons {
  [key: string]: FeatureIcon;
}

interface FeatureViewProps {
  title: string;
  description: string;
  bgColor: string;
}

export const FeatureView = ({ title, description, bgColor }: FeatureViewProps) => (
  <div className="flex items-center justify-center w-full h-full pt-20 p-8 text-center">
    <div className={`p-10 rounded-xl shadow-2xl text-white ${bgColor} max-w-md w-full`}>
      <h1 className="text-4xl font-extrabold mb-4">{title}</h1>
      <p className="text-lg">{description}</p>
    </div>
  </div>
);

