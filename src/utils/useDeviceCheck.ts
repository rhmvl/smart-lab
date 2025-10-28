import { useEffect, useState } from "react";

export function useDeviceCheck() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
    const mobileRegex = /android|iphone|ipad|ipod|blackberry|iemobile|opera mini/i;
    const isTrueMobile = mobileRegex.test(userAgent.toLowerCase());

    // detect forced desktop mode
    const width = window.innerWidth;
    const isInDesktopMode = width >= 768;

    setIsMobile(isTrueMobile && !isInDesktopMode);
  }, []);

  return isMobile;
}
