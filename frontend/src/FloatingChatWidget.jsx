import { useState } from 'react';

export default function FloatingChatWidget() {
  const [showTooltip, setShowTooltip] = useState(false);

  // Replace with your actual phone number (country code + number without '+')
  const whatsappNumber = '919494456926'; 
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=Hi%20Bala,%20I%20came%20across%20your%20portfolio%20and%20want%20to%20connect!`;

  return (
    <div className="fixed bottom-8 right-8 z-50 flex items-center pointer-events-auto">
      
      {/* Tooltip Card (Appears to the left on hover) */}
      {showTooltip && (
        <div className="mr-4 bg-[#0c2318]/95 dark:bg-slate-900/95 backdrop-blur-md text-emerald-100 text-xs font-medium px-4 py-2.5 rounded-xl shadow-xl border border-emerald-500/30 whitespace-nowrap flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          Chat with me on WhatsApp
        </div>
      )}

      {/* WhatsApp Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className="group relative w-14 h-14 sm:w-16 sm:h-16 bg-[#25D366] hover:bg-[#20ba5a] text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-all duration-300"
        aria-label="Chat with me on WhatsApp"
      >
        {/* Pulsing ring background glow */}
        <div className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-25 pointer-events-none"></div>
        <i className="fab fa-whatsapp text-2xl sm:text-3xl relative z-10"></i>
      </a>

    </div>
  );
}