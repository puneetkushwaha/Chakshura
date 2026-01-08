import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Loader2 } from 'lucide-react';

const LoadingScreen = ({ onLoadingComplete }) => {
    const [progress, setProgress] = useState(0);
    const [loadingText, setLoadingText] = useState('INITIALIZING SYSTEM');
    const [isComplete, setIsComplete] = useState(false);

    const loadingStages = [
        { progress: 20, text: 'LOADING DEFENSE PROTOCOLS' },
        { progress: 40, text: 'ESTABLISHING SECURE CONNECTION' },
        { progress: 60, text: 'SYNCHRONIZING DATA STREAMS' },
        { progress: 80, text: 'ACTIVATING INTELLIGENCE MODULES' },
        { progress: 100, text: 'SYSTEMS ONLINE' }
    ];

    useEffect(() => {
        let currentStage = 0;
        const interval = setInterval(() => {
            if (currentStage < loadingStages.length) {
                setProgress(loadingStages[currentStage].progress);
                setLoadingText(loadingStages[currentStage].text);
                currentStage++;
            } else {
                clearInterval(interval);
                setIsComplete(true);
                setTimeout(() => {
                    if (onLoadingComplete) {
                        onLoadingComplete();
                    }
                }, 800);
            }
        }, 600);

        return () => clearInterval(interval);
    }, []);

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="fixed inset-0 z-[9999] bg-[#050b14] flex flex-col items-center justify-center overflow-hidden"
            >
                {/* Animated Grid Background */}
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute inset-0" style={{
                        backgroundImage: 'linear-gradient(rgba(0,243,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,243,255,0.1) 1px, transparent 1px)',
                        backgroundSize: '50px 50px'
                    }} />
                </div>

                {/* Logo with Shield */}
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{
                        scale: 1,
                        opacity: isComplete ? 0 : 1
                    }}
                    transition={{ duration: 0.5 }}
                    className="relative z-10 mb-12"
                >
                    <div className="flex items-center gap-4">
                        <Shield className="w-16 h-16 text-neon-cyan" />
                        <div>
                            <h1 className="text-4xl font-military font-bold text-white tracking-widest">
                                CHAKSHURA
                            </h1>
                            <p className="text-xs uppercase tracking-[0.3em] text-neon-cyan">
                                Intelligence Radar
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* Expanding Shield Overlay */}
                {isComplete && (
                    <motion.div
                        initial={{ scale: 1, opacity: 1 }}
                        animate={{
                            scale: 50,
                            opacity: 0,
                            transition: { duration: 0.8, ease: "easeInOut" }
                        }}
                        className="absolute z-[10000] flex items-center justify-center"
                    >
                        <Shield className="w-16 h-16 text-neon-cyan" />
                    </motion.div>
                )}

                {/* Loading Bar */}
                <motion.div
                    animate={{ opacity: isComplete ? 0 : 1 }}
                    transition={{ duration: 0.3 }}
                    className="relative z-10 w-full max-w-md px-6"
                >
                    <div className="mb-6">
                        <p className="text-xs font-mono text-gray-400 uppercase tracking-wider text-center mb-2">
                            {loadingText}
                        </p>
                    </div>

                    <div className="relative h-2 bg-white/10 rounded-full overflow-hidden border border-white/20">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.5, ease: 'easeInOut' }}
                            className="h-full bg-gradient-to-r from-neon-cyan to-blue-500 shadow-[0_0_10px_rgba(0,243,255,0.5)]"
                        />
                    </div>

                    <div className="mt-3 text-center">
                        <span className="text-sm font-mono text-neon-cyan">
                            {progress}%
                        </span>
                    </div>
                </motion.div>

                {/* Loading Spinner */}
                <motion.div
                    animate={{
                        rotate: 360,
                        opacity: isComplete ? 0 : 1
                    }}
                    transition={{
                        rotate: { duration: 1, repeat: Infinity, ease: 'linear' },
                        opacity: { duration: 0.3 }
                    }}
                    className="relative z-10 mt-8"
                >
                    <Loader2 className="w-6 h-6 text-neon-cyan/50" />
                </motion.div>

                {/* Bottom Text */}
                <motion.div
                    animate={{ opacity: isComplete ? 0 : 1 }}
                    transition={{ duration: 0.3 }}
                    className="absolute bottom-8 text-center"
                >
                    <p className="text-[10px] font-mono text-gray-600 uppercase tracking-widest">
                        LOADING DEFENSE INTELLIGENCE PLATFORM
                    </p>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default LoadingScreen;
