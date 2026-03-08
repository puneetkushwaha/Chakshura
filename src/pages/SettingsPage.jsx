import React from 'react';
import { User, Shield, Lock, Bell, Database } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const SettingsSection = ({ title, icon: Icon, children }) => (
    <div className="bg-glass-dark border border-white/10 rounded-xl p-6 mb-6">
        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2 border-b border-white/10 pb-4">
            <Icon className="w-5 h-5 text-neon-cyan" />
            {title}
        </h3>
        {children}
    </div>
);

const SettingsPage = () => {
    const { profile, user } = useAuth();

    const firstName = profile?.firstName || "Operative";
    const lastName = profile?.lastName || "";
    const fullName = `${firstName} ${lastName}`.trim() || user?.email?.split('@')[0] || "Unknown Operative";
    const initials = `${firstName[0] || ""}${lastName[0] || ""}`.toUpperCase();

    const departmentRaw = profile?.department || "Strategic Analysis";
    const roleRaw = profile?.role || "analyst";
    
    // Normalize role string for display
    const clearanceLevel = roleRaw.toLowerCase() === 'admin' ? "LEVEL 5 CLEARANCE" :
                           roleRaw.toLowerCase() === 'scientist' ? "LEVEL 4 CLEARANCE" : "LEVEL 3 CLEARANCE";

    const adminTag = roleRaw.toUpperCase();

    return (
        <div className="max-w-4xl mx-auto px-4">
            <h1 className="text-xl sm:text-2xl font-military font-bold text-white mb-2">SYSTEM SETTINGS</h1>
            <p className="text-gray-400 text-xs sm:text-sm font-mono mb-6 sm:mb-8">ACCESS CONTROL & PREFERENCES</p>

            <SettingsSection title="USER PROFILE" icon={User}>
                <div className="flex items-center gap-6 mb-6">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-neon-cyan to-blue-600 p-[2px]">
                        <div className="w-full h-full rounded-full bg-military-900 flex items-center justify-center">
                            <span className="font-bold text-xl text-white">{initials || "🕵️"}</span>
                        </div>
                    </div>
                    <div>
                        <h4 className="text-xl font-bold text-white">{fullName}</h4>
                        <p className="text-gray-400 text-sm capitalize">{departmentRaw} • {roleRaw}</p>
                        <div className="flex gap-2 mt-2">
                            <span className="px-2 py-1 bg-neon-cyan/10 text-neon-cyan text-xs rounded border border-neon-cyan/20">{clearanceLevel}</span>
                            <span className="px-2 py-1 bg-neon-orange/10 text-neon-orange text-xs rounded border border-neon-orange/20">{adminTag}</span>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-xs font-mono text-gray-400">FULL NAME</label>
                        <input type="text" readOnly value={fullName} className="w-full bg-military-800/50 border border-white/10 rounded-lg py-2 px-3 text-white focus:outline-none focus:border-neon-cyan opacity-80" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-mono text-gray-400">EMAIL</label>
                        <input type="email" readOnly value={profile?.email || user?.email || ""} className="w-full bg-military-800/50 border border-white/10 rounded-lg py-2 px-3 text-white focus:outline-none focus:border-neon-cyan opacity-80" />
                    </div>
                </div>
            </SettingsSection>

            <SettingsSection title="SECURITY & ACCESS" icon={Lock}>
                <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                        <div>
                            <h5 className="text-sm font-bold text-white">Two-Factor Authentication</h5>
                            <p className="text-xs text-gray-400">Secure your account with 2FA</p>
                        </div>
                        <div className="w-12 h-6 bg-neon-cyan/20 rounded-full relative cursor-pointer">
                            <div className="absolute right-1 top-1 w-4 h-4 bg-neon-cyan rounded-full shadow-lg" />
                        </div>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                        <div>
                            <h5 className="text-sm font-bold text-white">API Access Keys</h5>
                            <p className="text-xs text-gray-400">Manage external application access</p>
                        </div>
                        <button className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded text-xs text-white transition-colors">MANAGE</button>
                    </div>
                </div>
            </SettingsSection>

            <SettingsSection title="NOTIFICATIONS" icon={Bell}>
                <div className="space-y-3">
                    {['Critical Alerts', 'Weekly Reports', 'System Updates', 'New Login Detected'].map((item) => (
                        <label key={item} className="flex items-center justify-between cursor-pointer group">
                            <span className="text-sm text-gray-300 group-hover:text-white">{item}</span>
                            <input type="checkbox" className="form-checkbox bg-white/5 border-white/20 rounded text-neon-cyan focus:ring-0" defaultChecked />
                        </label>
                    ))}
                </div>
            </SettingsSection>
        </div>
    );
};

export default SettingsPage;
