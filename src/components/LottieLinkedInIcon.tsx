import React, { useEffect, useRef } from "react";
import lottie from "lottie-web";

interface LottieLinkedInIconProps {
  style?: React.CSSProperties;
  className?: string;
  lottieUrl?: string;
}

const LottieLinkedInIcon: React.FC<LottieLinkedInIconProps> = ({ style, className, lottieUrl }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let animation: ReturnType<typeof lottie.loadAnimation> | null = null;
    let isMounted = true;
    const load = async () => {
      try {
        const url = lottieUrl || "https://lottie.host/8b2b5d27-6a81-46a7-addc-6244b32eccbc/Yz9Adwfnfx.json";
        const response = await fetch(url);
        const animationData = await response.json();
        if (containerRef.current && isMounted) {
          animation = lottie.loadAnimation({
            container: containerRef.current,
            renderer: "svg",
            loop: true,
            autoplay: true,
            animationData,
          });
        }
      } catch (e) {
        // fallback: do nothing
      }
    };
    load();
    return () => {
      isMounted = false;
      if (animation) animation.destroy();
    };
  }, [lottieUrl]);

  return <div ref={containerRef} style={style} className={className} />;
};

export default LottieLinkedInIcon;
