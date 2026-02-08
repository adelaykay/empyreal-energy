import React from 'react';

export const WhatsAppButton: React.FC = () => {
  const whatsappNumber = '2348021482053';
  const message = encodeURIComponent("Hi! I'm interested in learning more about your solar power solutions.");
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-gradient-to-br from-[#25D366] to-[#128C7E] rounded-full flex items-center justify-center shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-110 animate-float group"
      aria-label="Chat on WhatsApp"
    >
      {/* Tooltip */}
      <span className="absolute right-16 bg-white text-[#128C7E] px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg pointer-events-none">
        Speak to an agent
      </span>

      {/* WhatsApp Icon */}
      <svg 
        viewBox="0 0 32 32" 
        className="w-8 h-8 fill-white"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M16 0c-8.837 0-16 7.163-16 16 0 2.825 0.737 5.607 2.137 8.048l-2.137 7.952 8.135-2.135c2.369 1.281 5.010 1.948 7.865 1.948 8.837 0 16-7.163 16-16s-7.163-16-16-16zM16 29.467c-2.482 0-4.908-0.646-7.07-1.87l-0.507-0.292-5.245 1.377 1.401-5.208-0.331-0.536c-1.329-2.154-2.033-4.635-2.033-7.171 0-7.444 6.056-13.5 13.5-13.5s13.5 6.056 13.5 13.5-6.056 13.5-13.5 13.5zM21.958 18.833c-0.273-0.137-1.611-0.795-1.862-0.886-0.25-0.090-0.432-0.137-0.614 0.137s-0.705 0.886-0.864 1.068c-0.159 0.182-0.318 0.205-0.591 0.068s-1.152-0.425-2.194-1.354c-0.811-0.723-1.359-1.616-1.518-1.889s-0.017-0.421 0.120-0.557c0.123-0.123 0.273-0.318 0.41-0.478s0.182-0.273 0.273-0.455c0.091-0.182 0.046-0.341-0.023-0.478s-0.614-1.479-0.841-2.025c-0.221-0.531-0.446-0.459-0.614-0.467-0.159-0.008-0.341-0.010-0.523-0.010s-0.478 0.068-0.728 0.341c-0.25 0.273-0.955 0.933-0.955 2.274s0.978 2.638 1.114 2.820c0.137 0.182 1.925 2.938 4.664 4.121 0.652 0.282 1.161 0.450 1.557 0.576 0.655 0.208 1.251 0.179 1.722 0.108 0.525-0.079 1.611-0.659 1.839-1.295s0.228-1.182 0.159-1.295c-0.068-0.114-0.25-0.182-0.523-0.318z" />
      </svg>
    </a>
  );
};
