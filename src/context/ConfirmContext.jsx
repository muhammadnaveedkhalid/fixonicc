import { createContext, useContext, useState, useCallback } from 'react';
import ConfirmDialog from '../components/ConfirmDialog';

const ConfirmContext = createContext(null);

export const useConfirm = () => {
  const context = useContext(ConfirmContext);
  if (!context) {
    throw new Error('useConfirm must be used within a ConfirmProvider');
  }
  return context;
};

export const ConfirmProvider = ({ children }) => {
  const [dialog, setDialog] = useState({
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'Delete',
    type: 'danger',
    showInput: false,
    inputPlaceholder: '',
    resolver: null
  });

  const confirm = useCallback((title, message, options = {}) => {
    return new Promise((resolve) => {
      setDialog({
        isOpen: true,
        title,
        message,
        confirmText: options.confirmText || 'Delete',
        type: options.type || 'danger',
        showInput: false,
        resolver: resolve
      });
    });
  }, []);

  const prompt = useCallback((title, message, options = {}) => {
    return new Promise((resolve) => {
      setDialog({
        isOpen: true,
        title,
        message,
        confirmText: options.confirmText || 'Submit',
        type: options.type || 'info', // Default to info or danger depending on action
        showInput: true,
        inputPlaceholder: options.inputPlaceholder || 'Enter value...',
        resolver: resolve
      });
    });
  }, []);

  const handleConfirm = (value) => {
    if (dialog.resolver) {
      if (dialog.showInput) {
        dialog.resolver(value);
      } else {
        dialog.resolver(true);
      }
    }
    setDialog({ ...dialog, isOpen: false, resolver: null });
  };

  const handleCancel = () => {
    if (dialog.resolver) dialog.resolver(false);
    setDialog({ ...dialog, isOpen: false, resolver: null });
  };

  return (
    <ConfirmContext.Provider value={{ confirm, prompt }}>
      {children}
      <ConfirmDialog
        isOpen={dialog.isOpen}
        title={dialog.title}
        message={dialog.message}
        confirmText={dialog.confirmText}
        type={dialog.type}
        showInput={dialog.showInput}
        inputPlaceholder={dialog.inputPlaceholder}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </ConfirmContext.Provider>
  );
};
