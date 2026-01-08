import React from 'react';
import Navbar from './Navbar';
import { Outlet } from 'react-router-dom';

const MainLayout = () => {
    return (
        <div className="min-h-screen bg-military-900 text-white selection:bg-neon-cyan selection:text-military-900">
            <div className="fixed inset-0 z-0 pointer-events-none cyber-grid opacity-20" />
            <div className="fixed inset-0 z-0 pointer-events-none bg-gradient-to-b from-transparent via-military-900/50 to-military-900" />

            <Navbar />

            <main className="relative z-10 pt-20">
                <Outlet />
            </main>

            <footer className="relative z-10 border-t border-white/5 bg-military-900/80 backdrop-blur-sm py-8 mt-20">
                <div className="container mx-auto px-6 text-center">
                    <p className="text-gray-500 text-xs font-mono tracking-widest">
                        RESTRICTED ACCESS // DRDO CHAKSHURA INTELLIGENCE SYSTEM // CLASSIFIED
                    </p>
                    <p className="text-gray-600 text-[10px] mt-2">
                        &copy; 2025 DEFENCE RESEARCH & DEVELOPMENT ORGANISATION
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default MainLayout;
