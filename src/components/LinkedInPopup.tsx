import React, { useEffect, useState } from "react";

import Link from "next/link";
import LottieLinkedInIcon from "./LottieLinkedInIcon";
import { createPortal } from "react-dom";

const LinkedInPopup: React.FC = () => {
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
    window.open("https://www.linkedin.com/company/mhcaviation/", "_blank");
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
      <div className="fixed inset-0 bg-black/40 z-50" />
      {/* Popup */}
      <div className="fixed top-1/2 left-1/2 z-50 min-w-[340px] max-w-[95vw] rounded-2xl bg-white shadow-2xl transform -translate-x-1/2 -translate-y-1/2 animate-fadein">
        <div className="flex flex-row items-center p-8 pb-6">
          <div className="w-20 h-20 mr-6 flex items-center justify-center">
            <LottieLinkedInIcon className="w-20 h-20" />
          </div>
          <div className="flex-1">
            <p className="text-lg font-medium mb-4 text-[#0077b5]">
              Are you missing out on our insider updates?<br />
              Join <b>3,000+ professionals</b> already connected with us on LinkedIn
            </p>
            <div className="flex gap-3">
              <Link
                className="bg-[#0077b5] hover:bg-[#005983] text-white rounded-md px-5 py-2 font-semibold text-base transition-colors duration-200 no-underline"
                href="https://www.linkedin.com/company/mhcaviation/"
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleConnect}
              >
                Yes, Add Me 🚀
              </Link>
              <button
                className="border border-gray-300 rounded-md px-5 py-2 font-medium text-base text-gray-600 hover:border-[#0077b5] hover:text-[#0077b5] transition-colors duration-200"
                onClick={handleClose}
              >
                No, I&apos;ll risk missing out
              </button>
            </div>
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
