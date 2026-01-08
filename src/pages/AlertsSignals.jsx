import React from 'react';
import { AlertTriangle, Bell, Radio, Check, X } from 'lucide-react';

const AlertItem = ({ type, title, time, severity, status }) => (
    <div className="flex items-start gap-4 p-4 bg-glass-dark border border-white/10 rounded-xl hover:border-neon-cyan/30 transition-all group">
        <div className={`p-3 rounded-lg ${severity === 'CRITICAL' ? 'bg-red-500/10 text-red-500' :
            severity === 'HIGH' ? 'bg-neon-orange/10 text-neon-orange' :
                'bg-neon-cyan/10 text-neon-cyan'
            }`}>
            {type === 'SIGNAL' ? <Radio className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
        </div>

        <div className="flex-1">
            <div className="flex justify-between items-start">
                <h3 className="font-bold text-white group-hover:text-neon-cyan transition-colors">{title}</h3>
                <span className="text-xs text-gray-500 font-mono">{time}</span>
            </div>
            <p className="text-sm text-gray-400 mt-1">
                Detected anomaly in sector 7G. Signal pattern matches known signature variant B-12.
            </p>
            <div className="flex items-center gap-4 mt-3">
                <span className={`text-[10px] px-2 py-0.5 rounded border ${severity === 'CRITICAL' ? 'border-red-500/30 text-red-500' :
                    severity === 'HIGH' ? 'border-neon-orange/30 text-neon-orange' :
                        'border-neon-cyan/30 text-neon-cyan'
                    }`}>
                    {severity}
                </span>
                <span className="text-[10px] text-gray-500 font-mono">SOURCE: SATELLITE ARRAY 4</span>
            </div>
        </div>

        <div className="flex gap-2">
            <button className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors">
                <Check className="w-4 h-4" />
            </button>
            <button className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors">
                <X className="w-4 h-4" />
            </button>
        </div>
    </div>
);

const AlertsSignals = () => {
    return (
        <div className="max-w-4xl mx-auto space-y-6 px-4">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <div>
                    <h1 className="text-xl sm:text-2xl font-military font-bold text-white">THREAT SIGNALS</h1>
                    <p className="text-gray-400 text-xs sm:text-sm font-mono">LIVE SIGNAL FEED</p>
                </div>
                <button className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-xs sm:text-sm hover:bg-white/10 transition-colors w-full sm:w-auto">
                    MARK ALL READ
                </button>
            </div>

            <div className="space-y-4">
                <AlertItem type="ALERT" title="UNAUTHORIZED ACCESS ATTEMPT" time="JUST NOW" severity="CRITICAL" />
                <AlertItem type="SIGNAL" title="NEW PATENT FILED: HYPERSONIC PROPULSION" time="12m AGO" severity="HIGH" />
                <AlertItem type="SIGNAL" title="TECH MATURITY LEVEL INCREASED" time="45m AGO" severity="MEDIUM" />
                <AlertItem type="ALERT" title="DATA STREAM INTERRUPTION" time="1h AGO" severity="HIGH" />
                <AlertItem type="SIGNAL" title="COMPETITOR ANALYSIS UPDATE" time="2h AGO" severity="MEDIUM" />
            </div>
        </div>
    );
};

export default AlertsSignals;
