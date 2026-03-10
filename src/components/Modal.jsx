import { useEffect } from "react";
import { X } from "lucide-react";

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = "max-w-lg",
  className = "",
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => (document.body.style.overflow = "unset");
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-navy-900/60 backdrop-blur-sm animate-fade-in">
      <div
        className={`bg-white w-full ${size} rounded-[2.5rem] shadow-2xl overflow-hidden animate-slide-up relative flex flex-col max-h-[90vh] ${className}`}
      >
        {title && (
          <div className="p-8 border-b border-gray-50 flex items-center justify-between shrink-0">
            <h2 className="text-2xl font-black text-navy-900">{title}</h2>
            {onClose && (
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-navy-900 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            )}
          </div>
        )}
        <div className={`overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] ${title ? "" : "h-full"}`}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
