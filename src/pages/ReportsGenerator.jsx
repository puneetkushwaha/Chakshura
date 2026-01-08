import React from 'react';
import { FileText, Download, Printer, Share2 } from 'lucide-react';

const ReportsGenerator = () => {
    return (
        <div className="max-w-5xl mx-auto space-y-8 px-4">
            <div>
                <h1 className="text-xl sm:text-2xl font-military font-bold text-white">INTELLIGENCE REPORTS</h1>
                <p className="text-gray-400 text-xs sm:text-sm font-mono">GENERATE BRIEFING</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
                {/* Configuration Form */}
                <div className="lg:col-span-2 bg-glass-dark border border-white/10 rounded-xl p-4 sm:p-6 space-y-4 sm:space-y-6">
                    <h3 className="text-base sm:text-lg font-bold text-white border-b border-white/10 pb-4">REPORT CONFIGURATION</h3>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-xs font-mono text-gray-400">REPORT TITLE</label>
                            <input type="text" className="w-full bg-military-800/50 border border-white/10 rounded-lg py-2 px-3 text-white focus:border-neon-cyan focus:outline-none" placeholder="e.g., Q4 Strategic Analysis" />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-mono text-gray-400">DATE RANGE</label>
                                <select className="w-full bg-military-800/50 border border-white/10 rounded-lg py-2 px-3 text-white focus:border-neon-cyan focus:outline-none">
                                    <option>Last 24 Hours</option>
                                    <option>Last 7 Days</option>
                                    <option>Last 30 Days</option>
                                    <option>Custom Range</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-mono text-gray-400">FORMAT</label>
                                <select className="w-full bg-military-800/50 border border-white/10 rounded-lg py-2 px-3 text-white focus:border-neon-cyan focus:outline-none">
                                    <option>PDF Document</option>
                                    <option>Excel Spreadsheet</option>
                                    <option>JSON Data</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-mono text-gray-400">INCLUDE MODULES</label>
                            <div className="grid grid-cols-2 gap-3">
                                {['Global Radar Data', 'Patent Trends', 'TRL Updates', 'Signal Intercepts', 'Competitor Analysis', 'Threat Assessment'].map((item) => (
                                    <label key={item} className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
                                        <input type="checkbox" className="form-checkbox bg-white/5 border-white/20 rounded text-neon-cyan focus:ring-0" defaultChecked />
                                        {item}
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-mono text-gray-400">EXECUTIVE SUMMARY NOTES</label>
                            <textarea className="w-full bg-military-800/50 border border-white/10 rounded-lg py-2 px-3 text-white focus:border-neon-cyan focus:outline-none h-32" placeholder="Enter additional context..." />
                        </div>
                    </div>

                    <div className="pt-4 flex gap-4">
                        <button className="flex-1 py-3 bg-neon-cyan text-military-900 font-bold font-military tracking-wider hover:bg-white transition-all rounded-lg">
                            GENERATE REPORT
                        </button>
                        <button className="px-6 py-3 bg-transparent border border-white/10 text-white font-bold font-military tracking-wider hover:bg-white/5 transition-all rounded-lg">
                            PREVIEW
                        </button>
                    </div>
                </div>

                {/* Recent Reports */}
                <div className="bg-glass-dark border border-white/10 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-white border-b border-white/10 pb-4 mb-4">ARCHIVE</h3>
                    <div className="space-y-3">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="p-3 bg-white/5 rounded-lg border border-white/5 hover:border-neon-cyan/30 transition-all group">
                                <div className="flex items-center gap-3 mb-2">
                                    <FileText className="w-4 h-4 text-neon-cyan" />
                                    <span className="text-sm font-bold text-white truncate">Weekly Intel Brief #{100 + i}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-gray-500">Nov {20 - i}, 2025</span>
                                    <div className="flex gap-2">
                                        <button className="text-gray-400 hover:text-neon-cyan"><Download className="w-3 h-3" /></button>
                                        <button className="text-gray-400 hover:text-neon-cyan"><Share2 className="w-3 h-3" /></button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReportsGenerator;
