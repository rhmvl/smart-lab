import { StrictMode, useState, useEffect } from 'react';
import { SplashScreen } from './components/common/SplashScreen';
import App from './App';

export function Root() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function loadResources() {
      await new Promise(res => setTimeout(res, 4000));
      setIsReady(true);
    }
    loadResources();
  }, []);

  return (
    <>
      {!isReady && <SplashScreen />}
      {isReady && (
        <StrictMode>
          <App />
        </StrictMode>
      )}
    </>
  );
}

