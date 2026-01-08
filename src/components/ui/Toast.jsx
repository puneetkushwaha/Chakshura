import React, { createContext, useContext, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from 'lucide-react';

const ToastContext = createContext();

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within ToastProvider');
    }
    return context;
};

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const addToast = (message, type = 'info', duration = 3000) => {
        const id = Date.now();
        setToasts((prev) => [...prev, { id, message, type, duration }]);

        if (duration > 0) {
            setTimeout(() => {
                removeToast(id);
            }, duration);
        }
    };

    const removeToast = (id) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    };

    const toast = {
        success: (message, duration) => addToast(message, 'success', duration),
        error: (message, duration) => addToast(message, 'error', duration),
        warning: (message, duration) => addToast(message, 'warning', duration),
        info: (message, duration) => addToast(message, 'info', duration),
    };

    return (
        <ToastContext.Provider value={toast}>
            {children}
            <ToastContainer toasts={toasts} removeToast={removeToast} />
        </ToastContext.Provider>
    );
};

const ToastContainer = ({ toasts, removeToast }) => {
    const getToastConfig = (type) => {
        const configs = {
            success: {
                icon: CheckCircle2,
                bgColor: 'bg-green-500/10',
                borderColor: 'border-green-500/30',
                iconColor: 'text-green-400',
                progressColor: 'bg-green-400'
            },
            error: {
                icon: XCircle,
                bgColor: 'bg-red-500/10',
                borderColor: 'border-red-500/30',
                iconColor: 'text-red-400',
                progressColor: 'bg-red-400'
            },
            warning: {
                icon: AlertTriangle,
                bgColor: 'bg-orange-500/10',
                borderColor: 'border-orange-500/30',
                iconColor: 'text-orange-400',
                progressColor: 'bg-orange-400'
            },
            info: {
                icon: Info,
                bgColor: 'bg-blue-500/10',
                borderColor: 'border-blue-500/30',
                iconColor: 'text-blue-400',
                progressColor: 'bg-blue-400'
            }
        };
        return configs[type] || configs.info;
    };

    return (
        <div className="fixed top-4 right-4 z-[9999] space-y-3 pointer-events-none">
            <AnimatePresence>
                {toasts.map((toast) => {
                    const config = getToastConfig(toast.type);
                    const Icon = config.icon;

                    return (
                        <motion.div
                            key={toast.id}
                            initial={{ opacity: 0, y: -20, x: 100 }}
                            animate={{ opacity: 1, y: 0, x: 0 }}
                            exit={{ opacity: 0, x: 100 }}
                            className={`${config.bgColor} ${config.borderColor} border backdrop-blur-xl rounded-lg p-4 shadow-lg min-w-[320px] max-w-md pointer-events-auto`}
                        >
                            <div className="flex items-start gap-3">
                                <Icon className={`w-5 h-5 ${config.iconColor} flex-shrink-0 mt-0.5`} />
                                <p className="text-sm text-white flex-1 font-mono">{toast.message}</p>
                                <button
                                    onClick={() => removeToast(toast.id)}
                                    className="text-gray-400 hover:text-white transition-colors flex-shrink-0"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                            {toast.duration > 0 && (
                                <div className="mt-3 h-1 bg-white/10 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: '100%' }}
                                        animate={{ width: '0%' }}
                                        transition={{ duration: toast.duration / 1000, ease: 'linear' }}
                                        className={`h-full ${config.progressColor}`}
                                    />
                                </div>
                            )}
                        </motion.div>
                    );
                })}
            </AnimatePresence>
        </div>
    );
};
