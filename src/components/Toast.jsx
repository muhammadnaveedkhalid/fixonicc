import { useEffect } from "react";
import { CheckCircle, AlertCircle, XCircle, Info, X } from "lucide-react";

const Toast = ({ id, message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id);
    }, 5000);

    return () => clearTimeout(timer);
  }, [id, onClose]);

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-lime-500" />,
    error: <XCircle className="w-5 h-5 text-red-500" />,
    info: <Info className="w-5 h-5 text-blue-500" />,
    warning: <AlertCircle className="w-5 h-5 text-orange-500" />,
  };

  const bgColors = {
    success: "bg-white border-l-4 border-lime-500",
    error: "bg-white border-l-4 border-red-500",
    info: "bg-white border-l-4 border-blue-500",
    warning: "bg-white border-l-4 border-orange-500",
  };

  return (
    <div
      className={`flex items-center gap-3 p-4 rounded-xl shadow-2xl shadow-gray-200 border border-gray-100 min-w-[320px] transform transition-all duration-300 animate-slide-in ${
        bgColors[type] || bgColors.info
      }`}
    >
      <div className="flex-shrink-0">{icons[type] || icons.info}</div>
      <p className="flex-1 text-sm font-bold text-gray-700">{message}</p>
      <button
        onClick={() => onClose(id)}
        className="text-gray-400 hover:text-gray-600 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export default Toast;
