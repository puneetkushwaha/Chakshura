import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertTriangle, Home, ArrowLeft } from 'lucide-react';

const NotFoundPage = () => {
    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-[#050b14] relative overflow-hidden">
            {/* Animated Background Grid */}
            <div className="absolute inset-0 opacity-20">
                <div className="absolute inset-0" style={{
                    backgroundImage: 'linear-gradient(rgba(0,243,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,243,255,0.1) 1px, transparent 1px)',
                    backgroundSize: '50px 50px'
                }} />
            </div>

            <div className="relative z-10 container mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="max-w-2xl mx-auto text-center"
                >
                    {/* Alert Icon */}
                    <motion.div
                        animate={{
                            rotate: [0, 5, -5, 5, 0],
                        }}
                        transition={{
                            duration: 0.5,
                            repeat: Infinity,
                            repeatDelay: 3
                        }}
                        className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-neon-orange/10 border-2 border-neon-orange/30 mb-8"
                    >
                        <AlertTriangle className="w-12 h-12 text-neon-orange" />
                    </motion.div>

                    {/* Error Code */}
                    <h1 className="text-8xl md:text-9xl font-military font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-neon-orange mb-4">
                        404
                    </h1>

                    {/* Title */}
                    <h2 className="text-2xl md:text-3xl font-military font-bold text-white tracking-wider mb-4">
                        SECTOR NOT FOUND
                    </h2>

                    {/* Description */}
                    <p className="text-gray-400 text-base mb-8 max-w-md mx-auto font-mono">
                        The coordinates you're searching for don't exist in our intelligence database. Please verify and try again.
                    </p>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to="/">
                            <button className="group px-6 py-3 bg-neon-cyan border-2 border-neon-cyan text-military-900 font-military font-bold text-sm tracking-wider hover:bg-transparent hover:text-neon-cyan transition-all uppercase flex items-center gap-2 justify-center shadow-[0_0_20px_rgba(0,243,255,0.3)]">
                                <Home className="w-4 h-4" />
                                RETURN TO BASE
                            </button>
                        </Link>
                        <button
                            onClick={() => window.history.back()}
                            className="group px-6 py-3 bg-transparent border-2 border-white/30 text-white font-military font-bold text-sm tracking-wider hover:border-white hover:bg-white/10 transition-all uppercase flex items-center gap-2 justify-center"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            GO BACK
                        </button>
                    </div>

                    {/* Status Code */}
                    <div className="mt-12 pt-8 border-t border-white/10">
                        <p className="text-xs text-gray-600 font-mono uppercase tracking-widest">
                            ERROR CODE: HTTP 404 // PAGE NOT FOUND
                        </p>
                    </div>
                </motion.div>
            </div>

            {/* Corner Accents */}
            <div className="absolute top-0 left-0 w-32 h-32 border-t-2 border-l-2 border-neon-cyan/30" />
            <div className="absolute top-0 right-0 w-32 h-32 border-t-2 border-r-2 border-neon-cyan/30" />
            <div className="absolute bottom-0 left-0 w-32 h-32 border-b-2 border-l-2 border-neon-cyan/30" />
            <div className="absolute bottom-0 right-0 w-32 h-32 border-b-2 border-r-2 border-neon-cyan/30" />
        </div>
    );
};

export default NotFoundPage;
