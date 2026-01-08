import React from 'react';
import { Shield, Lock, Activity, FileText } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-military-900 border-t border-white/10 pt-16 pb-8 relative overflow-hidden">
            {/* Background Grid */}
            <div className="absolute inset-0 pointer-events-none opacity-10">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(0,243,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,243,255,0.1)_1px,transparent_1px)] bg-[size:40px_40px]" />
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    {/* Brand Column */}
                    <div className="col-span-1 md:col-span-1">
                        <div className="flex items-center gap-3 mb-6">
                            <Shield className="w-8 h-8 text-neon-cyan" />
                            <div className="flex flex-col">
                                <span className="text-xl font-military font-bold tracking-widest text-white">
                                    CHAKSHURA
                                </span>
                                <span className="text-[10px] uppercase tracking-[0.2em] text-neon-cyan">
                                    Intelligence Radar
                                </span>
                            </div>
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed mb-6">
                            Advanced defense analytics and technology intelligence platform.
                            Authorized personnel only.
                        </p>
                        <div className="flex items-center gap-2 text-xs font-mono text-neon-orange border border-neon-orange/30 bg-neon-orange/5 px-3 py-1 rounded w-fit">
                            <Lock className="w-3 h-3" />
                            <span>TOP SECRET // CLASSIFIED</span>
                        </div>
                    </div>

                    {/* Links Column 1 */}
                    <div>
                        <h4 className="text-white font-military font-bold tracking-wider mb-6">System</h4>
                        <ul className="space-y-3 text-sm text-gray-400">
                            <li><a href="#" className="hover:text-neon-cyan transition-colors flex items-center gap-2"><Activity className="w-3 h-3" /> System Status</a></li>
                            <li><a href="#" className="hover:text-neon-cyan transition-colors">Security Protocols</a></li>
                            <li><a href="#" className="hover:text-neon-cyan transition-colors">Access Logs</a></li>
                            <li><a href="#" className="hover:text-neon-cyan transition-colors">Maintenance</a></li>
                        </ul>
                    </div>

                    {/* Links Column 2 */}
                    <div>
                        <h4 className="text-white font-military font-bold tracking-wider mb-6">Legal</h4>
                        <ul className="space-y-3 text-sm text-gray-400">
                            <li><a href="#" className="hover:text-neon-cyan transition-colors flex items-center gap-2"><FileText className="w-3 h-3" /> Privacy Policy</a></li>
                            <li><a href="#" className="hover:text-neon-cyan transition-colors">Terms of Service</a></li>
                            <li><a href="#" className="hover:text-neon-cyan transition-colors">Data Compliance</a></li>
                        </ul>
                    </div>

                    {/* Newsletter/Input */}
                    <div>
                        <h4 className="text-white font-military font-bold tracking-wider mb-6">Secure Channel</h4>
                        <p className="text-gray-400 text-xs mb-4">Subscribe to intelligence briefings.</p>
                        <div className="flex">
                            <input
                                type="email"
                                placeholder="Enter secure ID..."
                                className="bg-white/5 border border-white/10 text-white text-sm px-4 py-2 rounded-l focus:outline-none focus:border-neon-cyan w-full"
                            />
                            <button className="bg-neon-cyan/10 border border-neon-cyan border-l-0 text-neon-cyan px-4 py-2 rounded-r hover:bg-neon-cyan hover:text-military-900 transition-colors">
                                →
                            </button>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-gray-500 text-xs font-mono">
                        © 2025 CHAKSHURA DEFENSE SYSTEMS. ALL RIGHTS RESERVED.
                    </p>
                    <div className="flex gap-6 text-gray-500 text-xs font-mono">
                        <span>V.2.5.0-ALPHA</span>
                        <span>SERVER: ASIA-SOUTH-1</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
