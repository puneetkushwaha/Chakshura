import React from 'react';
import { motion } from 'framer-motion';

const CyberHUD = () => {
    return (
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
            {/* Corner Brackets */}
            <div className="absolute top-6 left-6 w-16 h-16 border-t-2 border-l-2 border-neon-cyan/50 rounded-tl-lg" />
            <div className="absolute top-6 right-6 w-16 h-16 border-t-2 border-r-2 border-neon-cyan/50 rounded-tr-lg" />
            <div className="absolute bottom-6 left-6 w-16 h-16 border-b-2 border-l-2 border-neon-cyan/50 rounded-bl-lg" />
            <div className="absolute bottom-6 right-6 w-16 h-16 border-b-2 border-r-2 border-neon-cyan/50 rounded-br-lg" />

            {/* Scan Line */}
            <motion.div
                animate={{ top: ['0%', '100%'] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                className="absolute left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-neon-cyan/30 to-transparent shadow-[0_0_10px_#00f3ff]"
            />

            {/* Grid Overlay (Subtle) */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,243,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,243,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_80%)]" />
        </div>
    );
};

export default CyberHUD;
