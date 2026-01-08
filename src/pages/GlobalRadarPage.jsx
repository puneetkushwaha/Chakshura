import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Globe, MapPin, Layers, Menu, X } from 'lucide-react';
import HeroRadarGlobe from '../components/3d/HeroRadarGlobe';

const GlobalRadarPage = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="relative w-full h-[calc(100vh-80px)] overflow-hidden bg-military-900">
            {/* Sidebar - Always visible on desktop (md+), hidden on mobile */}
            <div className="hidden md:block absolute left-0 top-0 h-full w-80 bg-military-900/90 backdrop-blur-xl border-r border-white/10 p-6 z-10 overflow-y-auto">
                <h2 className="text-xl font-military font-bold text-white mb-6 flex items-center gap-2">
                    <Globe className="w-5 h-5 text-neon-cyan" />
                    GLOBAL TECH RADAR
                </h2>

                <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs font-mono text-gray-400">SEARCH REGION</label>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                            <input type="text" placeholder="Country, City..." className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-10 pr-3 text-sm text-white focus:border-neon-cyan focus:outline-none" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-mono text-gray-400">FILTERS</label>
                        <div className="space-y-2">
                            {['Military Tech', 'AI Research', 'Quantum Computing', 'Biotech', 'Hypersonics'].map((filter) => (
                                <label key={filter} className="flex items-center gap-2 text-sm text-gray-300 hover:text-white cursor-pointer group">
                                    <input type="checkbox" className="form-checkbox bg-white/5 border-white/20 rounded text-neon-cyan focus:ring-0" defaultChecked />
                                    <span className="group-hover:text-neon-cyan transition-colors">{filter}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="p-4 bg-neon-cyan/5 border border-neon-cyan/20 rounded-lg">
                        <h3 className="text-neon-cyan font-bold text-sm mb-2">ACTIVE ZONES</h3>
                        <div className="space-y-3">
                            {[
                                { name: 'East Asia', level: 'High', color: 'red-500' },
                                { name: 'North America', level: 'Moderate', color: 'yellow-500' },
                                { name: 'Eastern Europe', level: 'Critical', color: 'neon-orange' }
                            ].map((zone) => (
                                <div key={zone.name} className="flex items-center justify-between text-xs">
                                    <span className="text-gray-300">{zone.name}</span>
                                    <span className={`text-${zone.color} font-mono`}>{zone.level}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Sidebar */}
            <AnimatePresence>
                {sidebarOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSidebarOpen(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
                        />
                        <motion.div
                            initial={{ x: -320 }}
                            animate={{ x: 0 }}
                            exit={{ x: -320 }}
                            transition={{ type: 'tween', duration: 0.3 }}
                            className="fixed left-0 top-0 h-full w-80 bg-military-900/95 backdrop-blur-xl border-r border-white/10 p-6 z-50 overflow-y-auto"
                        >
                            <button
                                onClick={() => setSidebarOpen(false)}
                                className="absolute top-4 right-4 text-gray-400 hover:text-white"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            <h2 className="text-xl font-military font-bold text-white mb-6 flex items-center gap-2">
                                <Globe className="w-5 h-5 text-neon-cyan" />
                                GLOBAL TECH RADAR
                            </h2>

                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-mono text-gray-400">SEARCH REGION</label>
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                                        <input type="text" placeholder="Country, City..." className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-10 pr-3 text-sm text-white focus:border-neon-cyan focus:outline-none" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-mono text-gray-400">FILTERS</label>
                                    <div className="space-y-2">
                                        {['Military Tech', 'AI Research', 'Quantum Computing', 'Biotech', 'Hypersonics'].map((filter) => (
                                            <label key={filter} className="flex items-center gap-2 text-sm text-gray-300 hover:text-white cursor-pointer group">
                                                <input type="checkbox" className="form-checkbox bg-white/5 border-white/20 rounded text-neon-cyan focus:ring-0" defaultChecked />
                                                <span className="group-hover:text-neon-cyan transition-colors">{filter}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div className="p-4 bg-neon-cyan/5 border border-neon-cyan/20 rounded-lg">
                                    <h3 className="text-neon-cyan font-bold text-sm mb-2">ACTIVE ZONES</h3>
                                    <div className="space-y-3">
                                        {[
                                            { name: 'East Asia', level: 'High', color: 'red-500' },
                                            { name: 'North America', level: 'Moderate', color: 'yellow-500' },
                                            { name: 'Eastern Europe', level: 'Critical', color: 'neon-orange' }
                                        ].map((zone) => (
                                            <div key={zone.name} className="flex items-center justify-between text-xs">
                                                <span className="text-gray-300">{zone.name}</span>
                                                <span className={`text-${zone.color} font-mono`}>{zone.level}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Mobile Menu Button */}
            <button
                onClick={() => setSidebarOpen(true)}
                className="fixed md:hidden top-4 left-4 z-20 p-2 bg-military-900/80 border border-white/10 rounded-lg hover:bg-neon-cyan hover:text-military-900 transition-colors"
            >
                <Menu className="w-5 h-5" />
            </button>

            {/* Top Right Overlay */}
            <div className="absolute right-2 sm:right-6 top-2 sm:top-6 z-10 flex flex-col gap-2 sm:gap-4">
                <div className="p-3 sm:p-4 bg-military-900/80 backdrop-blur-md border border-white/10 rounded-lg w-48 sm:w-64">
                    <h3 className="text-[10px] sm:text-xs font-mono text-gray-400 mb-2">SELECTED TARGET</h3>
                    <div className="text-base sm:text-xl font-bold text-white font-military">SHANGHAI, CN</div>
                    <div className="text-neon-cyan text-xs sm:text-sm font-mono mt-1">31.2304° N, 121.4737° E</div>
                    <div className="mt-2 sm:mt-3 h-1 w-full bg-gray-700 rounded-full overflow-hidden">
                        <div className="h-full bg-neon-orange w-3/4 animate-pulse" />
                    </div>
                    <div className="flex justify-between text-[10px] text-gray-500 mt-1">
                        <span>SIGNAL STRENGTH</span>
                        <span>78%</span>
                    </div>
                </div>

                <div className="flex gap-2 justify-end">
                    <button className="p-2 sm:p-3 bg-military-900/80 border border-white/10 rounded-lg hover:bg-neon-cyan hover:text-military-900 transition-colors">
                        <Layers className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                    <button className="p-2 sm:p-3 bg-military-900/80 border border-white/10 rounded-lg hover:bg-neon-cyan hover:text-military-900 transition-colors">
                        <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                </div>
            </div>

            {/* Globe Container - shifts right on desktop when sidebar is visible */}
            <div className="absolute inset-0 md:left-80">
                <HeroRadarGlobe />
            </div>
        </div>
    );
};

export default GlobalRadarPage;
