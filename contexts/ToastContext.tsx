import React, { createContext, useContext, ReactNode } from 'react';
import { View } from 'react-native';
import Toast from '@/components/Toast';
import { useToast, ToastMessage } from '@/hooks/useToast';

interface ToastContextType {
  showToast: (
    type: 'success' | 'error' | 'warning' | 'info',
    title: string,
    message?: string,
    duration?: number,
    onPress?: () => void
  ) => void;
  showSuccess: (title: string, message?: string, duration?: number) => void;
  showError: (title: string, message?: string, duration?: number) => void;
  showWarning: (title: string, message?: string, duration?: number) => void;
  showInfo: (title: string, message?: string, duration?: number) => void;
  clearAll: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToastContext = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToastContext must be used within a ToastProvider');
  }
  return context;
};

interface ToastProviderProps {
  children: ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const { toasts, showToast, hideToast, showSuccess, showError, showWarning, showInfo, clearAll } = useToast();

  const contextValue: ToastContextType = {
    showToast,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    clearAll,
  };

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      
      {/* Toast Container */}
      <View style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 1000 }}>
        {toasts.map((toast, index) => (
          <Toast
            key={toast.id}
            visible={true}
            type={toast.type}
            title={toast.title}
            message={toast.message}
            duration={toast.duration}
            onClose={() => hideToast(toast.id)}
            onPress={toast.onPress}
          />
        ))}
      </View>
    </ToastContext.Provider>
  );
}; 