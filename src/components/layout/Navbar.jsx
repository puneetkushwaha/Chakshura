import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Menu, X, LogIn, UserPlus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
    const [isMounted, setIsMounted] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Close menu when clicking outside
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isMobileMenuOpen]);

    return (
        <nav className="fixed top-0 left-0 w-full z-50 bg-military-900/30 backdrop-blur-xl border-b border-white/20 py-4 shadow-lg shadow-black/50">
            <div className="container mx-auto px-4 sm:px-6 flex items-center justify-between">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2 sm:gap-3 group">
                    <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-neon-cyan" />
                    <div className="flex flex-col">
                        <span className="text-base sm:text-xl font-military font-bold tracking-widest text-white">
                            CHAKSHURA
                        </span>
                        <span className="text-[8px] sm:text-[10px] uppercase tracking-[0.2em] text-neon-cyan">
                            Intelligence Radar
                        </span>
                    </div>
                </Link>

                {/* Desktop Navigation - Login Button */}
                <div className="hidden md:block">
                    <Link to="/login">
                        <button className="px-6 py-2 bg-transparent border border-neon-cyan text-neon-cyan font-mono text-xs font-bold tracking-widest hover:bg-neon-cyan hover:text-military-900 transition-all">
                            ACCESS TERMINAL
                        </button>
                    </Link>
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden text-white p-2 hover:text-neon-cyan transition-colors"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    aria-label="Toggle menu"
                >
                    {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 md:hidden"
                        />

                        {/* Slide-in Menu */}
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'tween', duration: 0.3 }}
                            className="fixed top-0 right-0 h-full w-[280px] bg-[#0a1625] border-l border-neon-cyan/30 shadow-2xl z-50 md:hidden"
                        >
                            {/* Menu Header */}
                            <div className="flex items-center justify-between p-6 border-b border-white/10">
                                <span className="text-sm font-military font-bold text-white tracking-wider">
                                    NAVIGATION
                                </span>
                                <button
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="text-gray-400 hover:text-white transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Menu Items */}
                            <div className="flex flex-col p-6 gap-4">
                                {/* Login */}
                                <Link
                                    to="/login"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="group"
                                >
                                    <motion.div
                                        whileHover={{ x: 5 }}
                                        className="flex items-center gap-3 p-4 bg-neon-cyan/10 border border-neon-cyan/30 rounded-lg hover:bg-neon-cyan/20 hover:border-neon-cyan transition-all"
                                    >
                                        <LogIn className="w-5 h-5 text-neon-cyan" />
                                        <div>
                                            <div className="text-sm font-bold text-white group-hover:text-neon-cyan transition-colors">
                                                Login
                                            </div>
                                            <div className="text-[10px] text-gray-500 font-mono">
                                                ACCESS TERMINAL
                                            </div>
                                        </div>
                                    </motion.div>
                                </Link>

                                {/* Signup */}
                                <Link
                                    to="/signup"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="group"
                                >
                                    <motion.div
                                        whileHover={{ x: 5 }}
                                        className="flex items-center gap-3 p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg hover:bg-purple-500/20 hover:border-purple-400 transition-all"
                                    >
                                        <UserPlus className="w-5 h-5 text-purple-400" />
                                        <div>
                                            <div className="text-sm font-bold text-white group-hover:text-purple-400 transition-colors">
                                                Sign Up
                                            </div>
                                            <div className="text-[10px] text-gray-500 font-mono">
                                                REQUEST CLEARANCE
                                            </div>
                                        </div>
                                    </motion.div>
                                </Link>

                                {/* Divider */}
                                <div className="h-px bg-white/10 my-2" />

                                {/* Status Indicator */}
                                <div className="flex items-center gap-2 p-3 bg-white/5 rounded-lg">
                                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                                    <span className="text-[10px] text-gray-400 font-mono uppercase tracking-wider">
                                        System Online
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
