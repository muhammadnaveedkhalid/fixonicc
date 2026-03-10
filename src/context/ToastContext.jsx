import { createContext, useContext, useState, useCallback } from 'react';
import Toast from '../components/Toast';

const ToastContext = createContext(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'info') => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed top-16 left-1/2 -translate-x-1/2 z-[9999] space-y-4 pointer-events-none">
         <div className="flex flex-col gap-2 pointer-events-auto">
            {toasts.map((toast) => (
            <Toast
                key={toast.id}
                {...toast}
                onClose={removeToast}
            />
            ))}
         </div>
      </div>
    </ToastContext.Provider>
  );
};
