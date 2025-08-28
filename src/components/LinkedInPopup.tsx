import React, { useEffect, useState } from "react";

import Link from "next/link";
import Image from "next/image";
import LottieLinkedInIcon from "./LottieLinkedInIcon";
import { createPortal } from "react-dom";

interface LinkedInPopupProps {
  headline?: React.ReactNode;
  addMeText?: string;
  addMeUrl?: string;
  onConnect?: () => void;
  declineText?: string;
  lottieUrl?: string;
  imageUrl?: string;
  imageWidth?: number;
  imageHeight?: number;
}

const LinkedInPopup: React.FC<LinkedInPopupProps> = ({
  headline = (<><span>Are you missing out on our insider updates?<br />Join <b>3,000+ professionals</b> already connected with us on LinkedIn</span></>),
  addMeText = "Yes, Add Me 🚀",
  addMeUrl = "https://www.linkedin.com/company/mhcaviation/",
  onConnect,
  declineText = "No, I'll risk missing out",
  lottieUrl,
  imageUrl,
  imageWidth = 112,
  imageHeight = 112,
}) => {
  const [mounted, setMounted] = useState(false);
  const [show, setShow] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (
      typeof window !== "undefined" &&
      localStorage.getItem("mhc_linkedin_popup_dismissed") !== "true"
    ) {
      setShow(true);
    }
  }, []);


  const handleConnect = () => {
    if (onConnect) {
      onConnect();
    } else {
      window.open(addMeUrl, "_blank");
    }
    localStorage.setItem("mhc_linkedin_popup_dismissed", "true");
    setShow(false);
  };

  const handleClose = () => {
    setShow(false);
  };

  if (!mounted || !show) return null;

  return createPortal(
    <>
      {/* Overlay */}
  <div className="fixed inset-0 bg-blue-950/80 backdrop-blur-[16px] z-50" />
      {/* Popup */}
      <div className="fixed top-1/2 left-1/2 z-50 w-[95vw] max-w-md rounded-2xl bg-white shadow-2xl transform -translate-x-1/2 -translate-y-1/2 animate-fadein flex flex-col items-center p-0">
        <div className="flex flex-col items-center w-full px-8 pt-10 pb-8">
          <div className="w-36 h-36 rounded-full border-8 border-[#2d2e5e]/10 flex items-center justify-center mb-8 bg-white overflow-hidden">
            {imageUrl ? (
              <Image src={imageUrl} alt="Popup Icon" width={imageWidth} height={imageHeight} className="object-contain" unoptimized />
            ) : (
              <LottieLinkedInIcon className="w-28 h-28" lottieUrl={lottieUrl} />
            )}
          </div>
          <p className="text-center text-base text-black mb-8">
            {headline}
          </p>
          <div className="flex flex-col gap-3 w-full">
            <Link
              className="w-full bg-[#377dff] hover:bg-[#2d5fd7] text-white rounded-md px-5 py-3 font-semibold text-base transition-colors duration-200 no-underline text-center border-2 border-[#377dff]"
              href={addMeUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleConnect}
            >
              {addMeText}
            </Link>
            <button
              className="w-full border-2 border-[#377dff] rounded-md px-5 py-3 font-medium text-base text-[#377dff] bg-white hover:bg-[#f5f8ff] transition-colors duration-200 text-center"
              onClick={handleClose}
            >
              {declineText}
            </button>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes fadein {
          from { opacity: 0; transform: translate(-50%, -60%); }
          to { opacity: 1; transform: translate(-50%, -50%); }
        }
        .animate-fadein { animation: fadein 0.3s; }
      `}</style>
    </>,
    document.body
  );
};

export default LinkedInPopup;
