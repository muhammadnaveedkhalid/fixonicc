import { useState, useEffect } from 'react';
import { AlertTriangle } from "lucide-react";
import Modal from "./Modal";

const ConfirmDialog = ({ isOpen, title, message, onConfirm, onCancel, confirmText = "Delete", type = "danger", showInput = false, inputPlaceholder = "" }) => {
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    if (isOpen) setInputValue("");
  }, [isOpen]);

  if (!isOpen) return null;

  const isSuccess = type === "success";

  return (
    <Modal isOpen={isOpen} onClose={onCancel} size="max-w-sm">
      <div className="p-8 text-center">
        <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 ${isSuccess ? "bg-green-50 text-green-500" : "bg-red-50 text-red-500"
          }`}>
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-black text-navy-900 mb-2">{title}</h3>
        <p className="text-gray-500 text-sm font-medium leading-relaxed mb-8">
          {message}
        </p>

        {showInput && (
          <div className="mb-6">
            <textarea
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-navy-500 focus:border-navy-500 rounded-xl bg-navy-50/50 border-navy-100 transition-all text-sm"
              rows="3"
              placeholder={inputPlaceholder}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            ></textarea>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={onCancel}
            className="py-4 px-6 bg-gray-50 text-gray-700 font-black rounded-2xl hover:bg-gray-100 transition-colors uppercase tracking-widest text-xs"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(inputValue)}
            className={`py-4 px-6 font-black rounded-2xl shadow-xl transition-all uppercase tracking-widest text-xs text-white ${isSuccess
              ? "bg-green-500 shadow-green-500/20 hover:bg-green-600"
              : "bg-red-500 shadow-red-500/20 hover:bg-red-600"
              }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;
