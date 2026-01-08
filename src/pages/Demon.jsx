import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity, TrendingUp, Target, Clock, AlertCircle, ChevronRight, Calendar, Database, FileText, DollarSign, CheckCircle, AlertTriangle, Info } from 'lucide-react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Label } from 'recharts';

// --- START DUMMY DATA INJECTION ---

const rawPatents = [
    {
        "id": "PAT0035",
        "patentId": "P000035",
        "title": "Supersonic cruise missiles – adaptive control architecture #035",
        "year": 2010,
        "country": "IN",
        "ipc": "F41G",
        "classificationConfidence": 0.93,
        "mainCategoryId": "MISSILE_SYSTEMS",
        "subCategoryId": "CRUISE_MISSILES",
        "subSubCategoryId": "SUPERSONIC_CRUISE"
    },
];

const rawInvestments = [
    {
        "id": "INV0194",
        "title": "Supersonic cruise missiles applied R&D programme #194",
        "amount": 6000000,
        "currency": "USD",
        "year": 2022,
        "country": "JP",
        "funder": "DRDO",
        "mainCategoryId": "MISSILE_SYSTEMS",
        "subCategoryId": "CRUISE_MISSILES",
        "subSubCategoryId": "SUPERSONIC_CRUISE"
    },
];

const rawResearchPapers = [
    {
        "id": "RP0160",
        "title": "Experimental evaluation of supersonic cruise missiles #160",
        "abstract": "We present a detailed study of supersonic cruise missiles with focus on control algorithms, system modelling and performance under contested operational conditions relevant to defence applications.",
        "year": 2013,
        "venue": "DRDO Journal",
        "mainCategoryId": "MISSILE_SYSTEMS",
        "subCategoryId": "CRUISE_MISSILES",
        "subSubCategoryId": "SUPERSONIC_CRUISE"
    },
    {
        "id": "RP0162",
        "title": "Experimental evaluation of supersonic cruise missiles #162",
        "abstract": "We present a detailed study of supersonic cruise missiles with focus on control algorithms, system modelling and performance under contested operational conditions relevant to defence applications.",
        "year": 2020,
        "venue": "Military Robotics Review",
        "mainCategoryId": "MISSILE_SYSTEMS",
        "subCategoryId": "CRUISE_MISSILES",
        "subSubCategoryId": "SUPERSONIC_CRUISE"
    },
];

// Combine all data into a single object for easier access
const allData = {
    patents: rawPatents,
    investments: rawInvestments,
    papers: rawResearchPapers,
};

// --- Data Processing Logic ---
const getAnnualActivity = (data, startYear = 2010, endYear = 2025) => {
    const years = Array.from({ length: endYear - startYear + 1 }, (_, i) => startYear + i);
    const activityMap = years.map(year => ({
        year: String(year),
        patents: 0,
        papers: 0,
        rd: 0,
        // Using USD as the base for R&D amount for simplicity
        rdAmountUSD: 0,
    }));

    // Process Patents
    data.patents.forEach(p => {
        const entry = activityMap.find(a => Number(a.year) === p.year);
        if (entry) {
            entry.patents += 1;
        }
    });

    // Process Papers
    data.papers.forEach(p => {
        const entry = activityMap.find(a => Number(a.year) === p.year);
        if (entry) {
            entry.papers += 1;
        }
    });

    // Process R&D (Investments)
    // Simple conversion/estimation for non-USD currencies for graph scaling
    const conversionRates = {
        'USD': 1,
        'EUR': 1.1, // Dummy rate
        'INR': 0.012, // Dummy rate
        // Assuming R&D value is scaled down for chart visibility
    };

    data.investments.forEach(i => {
        const entry = activityMap.find(a => Number(a.year) === i.year);
        if (entry) {
            const amountUSD = i.amount * (conversionRates[i.currency] || 1);
            entry.rdAmountUSD += amountUSD;
            // Scale R&D amount down for graph (e.g., millions to units)
            entry.rd += Math.round(amountUSD / 1000000);
        }
    });

    // Calculate cumulative values and simplify output for the component
    let cumPatents = 0;
    let cumPapers = 0;
    let cumRD = 0;
    let cumRDAmountUSD = 0;

    return {
        activityData: activityMap.map(a => {
            cumPatents += a.patents;
            cumPapers += a.papers;
            cumRD += a.rd;
            cumRDAmountUSD += a.rdAmountUSD;

            return {
                year: a.year,
                patents: cumPatents, // Using cumulative count for the AreaChart
                papers: cumPapers,   // Using cumulative count for the AreaChart
                rd: cumRD,           // Using cumulative count for the AreaChart
            };
        }),
        latestActivity: {
            patents: cumPatents,
            papers: cumPapers,
            rdAmount: cumRDAmountUSD,
            lastYear: endYear,
        }
    };
};

const { activityData, latestActivity } = getAnnualActivity(allData);

// --- TRL Logic (Based on the sparse data) ---

// Define TRL based on activity (simplified for dummy data)
// Activity starts low (2010), peaks around 2022 (investment), papers in 2020.
// TRL: 2010(1.0) -> 2013(2.0) -> 2020(3.5) -> 2022(4.5) -> 2025(4.8) (forecast for 2025)
const initialTrlProgression = [
    { year: '2010', trl: 1.0, type: 'past' },
    { year: '2013', trl: 2.0, type: 'past' },
    { year: '2018', trl: 3.0, type: 'past' },
    { year: '2020', trl: 3.5, type: 'past' },
    { year: '2022', trl: 4.5, type: 'past' },
];

const projectedTrlProgression = [
    { year: '2024', trl: 4.8, type: 'forecast' },
    { year: '2026', trl: 5.5, type: 'forecast' }, // Projected TRL rise due to past investments
    { year: '2029', trl: 6.0, type: 'forecast' }, // Operational Readiness target
    { year: '2032', trl: 7.0, type: 'forecast' }
];

const trlProgressionData = [...initialTrlProgression, ...projectedTrlProgression].sort((a, b) => a.year - b.year);

// Calculate Current TRL (using latest known point in past)
const currentTrl = initialTrlProgression[initialTrlProgression.length - 1].trl;

// --- S-Curve Logic ---

// Adopted a more granular S-Curve profile based on the general expected maturity
const sCurveData = [
    { year: '2010', adoption: 5, phase: 'Early R&D' },
    { year: '2012', adoption: 8, phase: 'Early R&D' },
    { year: '2015', adoption: 15, phase: 'Growth' },
    { year: '2018', adoption: 25, phase: 'Growth' },
    { year: '2022', adoption: 40, phase: 'Acceleration' }, // Current position close to midpoint
    { year: '2024', adoption: 55, phase: 'Acceleration' },
    { year: '2026', adoption: 70, phase: 'Acceleration' },
    { year: '2029', adoption: 85, phase: 'Rapid Growth' },
    { year: '2032', adoption: 95, phase: 'Maturity' },
];

// --- Forecast Table Logic ---
const forecastTable = [
    { year: 2025, trl: '4.8', patentGrowth: '+8%', paperGrowth: '+5%', rdInvestment: 'Stable', risk: 'Medium-Low', notes: 'Maturing prototype stage' },
    { year: 2027, trl: '5.8', patentGrowth: '+15%', paperGrowth: '+10%', rdInvestment: 'Increased', risk: 'Medium', notes: 'Subsystem integration' },
    { year: 2029, trl: '6.5', patentGrowth: '+20%', paperGrowth: '+12%', rdInvestment: 'High', risk: 'Medium', notes: 'Early operational testing begins' },
    { year: 2032, trl: '7.0', patentGrowth: '+10%', paperGrowth: '+5%', rdInvestment: 'Stable', risk: 'Low', notes: 'Pre-production readiness' }
];

// --- Signals & Recommendations Logic ---
const totalActivity = latestActivity.patents + latestActivity.papers + latestActivity.rd;
const avgAnnualGrowthRate =
    latestActivity.lastYear > initialTrlProgression[0].year
        ? Math.round(
            ((latestActivity.patents + latestActivity.papers + latestActivity.rd) /
                (activityData.find(d => Number(d.year) === Number(initialTrlProgression[0].year)).patents +
                    activityData.find(d => Number(d.year) === Number(initialTrlProgression[0].year)).papers +
                    activityData.find(d => Number(d.year) === Number(initialTrlProgression[0].year)).rd))
            ** (1 / (latestActivity.lastYear - Number(initialTrlProgression[0].year))) - 1
        ) * 100
        : 10; // Fallback dummy rate

const signals = [
    { type: 'positive', text: `Investment surge ($${(latestActivity.rdAmount / 1000000).toFixed(1)}M+) in 2022`, impact: 'High' },
    { type: 'positive', text: `First patent filed in 2010 (long gestation period)`, impact: 'Low' },
    { type: 'neutral', text: `Academic paper concentration in DRDO/Military Robotics Review venues`, impact: 'Medium' },
    { type: 'risk', text: 'Limited public data from major US/China players (potential for sudden leap)', impact: 'High' },
    { type: 'positive', text: 'Steady TRL progression, no major setbacks noted in public literature', impact: 'Medium' }
];

const recommendations = [
    'Focus on propulsion and airframe R&D for next breakthrough.',
    'Monitor patent filings in India (IN) and Japan (JP) which hold the existing data points.',
    'High potential for deployment by 2030 in initial-adopting nations.',
    'Invest in counter-hypersonic/supersonic defense alongside R&D.',
    'Track materials science literature for airframe durability and heat resistance.'
];

// --- END DUMMY DATA INJECTION ---


const TechForecastingDashboard = () => {
    // Retain state and logic for interactivity, using new data arrays
    const [timeRange, setTimeRange] = useState('10');
    const [region, setRegion] = useState('Global');
    const [dataSource, setDataSource] = useState('All');

    // Mapped TRL Progression Data
    const trlData = trlProgressionData;

    // Mapped Activity Over Time Data (using cumulative activity for area chart visualization)
    const activityChartData = activityData;

    // Mapped S-Curve Data
    const sCurveChartData = sCurveData;

    // Mapped Forecast Table Data
    const forecastData = forecastTable;

    // Current Status Metrics
    const statusMetrics = {
        currentTrl: currentTrl.toFixed(1),
        maturityStage: 'Growth Acceleration',
        growthRate: `${avgAnnualGrowthRate}% / year`,
        timeToOperational: `Expected TRL 6 by 2029`,
        timeToDeployment: `Expected TRL 7 by 2032`,
        confidence: '82%', // Adjusted based on TRL and activity data density
    };

    const getRiskColor = (risk) => {
        switch (risk) {
            case 'Low': return 'text-green-400 bg-green-500/10';
            case 'Medium-Low': return 'text-lime-400 bg-lime-500/10';
            case 'Medium': return 'text-yellow-400 bg-yellow-500/10';
            case 'High': return 'text-orange-400 bg-orange-500/10';
            default: return 'text-slate-400 bg-slate-500/10';
        }
    };

    const getSignalIcon = (type) => {
        switch (type) {
            case 'positive': return <CheckCircle className="w-4 h-4 text-green-400" />;
            case 'neutral': return <Info className="w-4 h-4 text-blue-400" />;
            case 'risk': return <AlertTriangle className="w-4 h-4 text-orange-400" />;
            default: return <Info className="w-4 h-4 text-slate-400" />;
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white font-sans">
            {/* Header Section */}
            <div className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-sm border-b border-slate-800">
                <div className="px-6 py-4">
                    {/* Breadcrumb */}
                    <div className="flex items-center gap-2 text-sm mb-3">
                        <span className="text-slate-400 hover:text-cyan-400 cursor-pointer">Missile Systems</span>
                        <ChevronRight className="w-4 h-4 text-slate-600" />
                        <span className="text-slate-400 hover:text-cyan-400 cursor-pointer">Cruise Missiles</span>
                        <ChevronRight className="w-4 h-4 text-slate-600" />
                        <span className="text-cyan-400">Supersonic Cruise Missiles</span>
                        <ChevronRight className="w-4 h-4 text-slate-600" />
                        <span className="text-cyan-400">Forecasting & TRL</span>
                    </div>

                    {/* Title & Filters */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold mb-1">Technology Forecasting & TRL Progression</h1>
                            <p className="text-sm text-slate-400">Technology: **Supersonic Cruise Missiles**</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <select
                                value={timeRange}
                                onChange={(e) => setTimeRange(e.target.value)}
                                className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm"
                            >
                                <option value="5">5 years</option>
                                <option value="10">10 years</option>
                                <option value="15">15 years</option>
                            </select>
                            <select
                                value={region}
                                onChange={(e) => setRegion(e.target.value)}
                                className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm"
                            >
                                <option>Global</option>
                                <option>Asia</option>
                                <option>Europe</option>
                                <option>US</option>
                                <option>India</option>
                            </select>
                            <select
                                value={dataSource}
                                onChange={(e) => setDataSource(e.target.value)}
                                className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm"
                            >
                                <option>All Sources</option>
                                <option>Patents</option>
                                <option>Papers</option>
                                <option>R&D</option>
                                <option>Investments</option>
                            </select>
                        </div>
                    </div>
                    <p className="text-xs text-slate-500 mt-2">Data based on patents, investments, and research papers for Supersonic Cruise Missiles.</p>
                </div>
            </div>

            {/* Main Content */}
            <div className="p-6 max-w-[1600px] mx-auto">

                {/* SECTION A - Current Status Summary */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <Activity className="w-5 h-5 text-cyan-400" />
                        Current Technology Status Summary
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-gradient-to-br from-cyan-500/10 to-cyan-500/5 border border-cyan-500/30 rounded-lg p-5">
                            <Target className="w-8 h-8 text-cyan-400 mb-3" />
                            <p className="text-xs text-slate-400 mb-1">Estimated Current TRL</p>
                            <p className="text-3xl font-bold text-cyan-400 mb-2">{statusMetrics.currentTrl}</p>
                            <p className="text-xs text-slate-300">System/subsystem prototype validation in relevant environment</p>
                        </div>

                        <div className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 border border-purple-500/30 rounded-lg p-5">
                            <TrendingUp className="w-8 h-8 text-purple-400 mb-3" />
                            <p className="text-xs text-slate-400 mb-1">Maturity Stage</p>
                            <p className="text-xl font-bold text-purple-400 mb-2">{statusMetrics.maturityStage}</p>
                            <p className="text-xs text-slate-300">Activity Growth Rate: <span className="text-green-400 font-semibold">{statusMetrics.growthRate}</span> (estimated cumulative)</p>
                        </div>

                        <div className="bg-gradient-to-br from-orange-500/10 to-orange-500/5 border border-orange-500/30 rounded-lg p-5">
                            <Clock className="w-8 h-8 text-orange-400 mb-3" />
                            <p className="text-xs text-slate-400 mb-1">Estimated Time-to-Deployment</p>
                            <p className="text-sm text-orange-400 font-semibold mb-1">{statusMetrics.timeToOperational}</p>
                            <p className="text-xs text-slate-300">{statusMetrics.timeToDeployment}</p>
                        </div>

                        <div className="bg-gradient-to-br from-green-500/10 to-green-500/5 border border-green-500/30 rounded-lg p-5">
                            <AlertCircle className="w-8 h-8 text-green-400 mb-3" />
                            <p className="text-xs text-slate-400 mb-1">Forecast Confidence</p>
                            <p className="text-3xl font-bold text-green-400 mb-2">{statusMetrics.confidence}</p>
                            <p className="text-xs text-slate-300">Medium-High confidence based on recent investment signals.</p>
                        </div>
                    </div>
                </motion.div>

                {/* SECTION B - TRL Progression Chart */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-slate-900/50 border border-slate-800 rounded-lg p-6 mb-8"
                >
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <Target className="w-5 h-5 text-cyan-400" />
                        TRL Progression Chart (Past & Predicted)
                    </h2>
                    <ResponsiveContainer width="100%" height={400}>
                        <LineChart data={trlData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                            <XAxis dataKey="year" stroke="#94a3b8" />
                            <YAxis domain={[0, 9]} stroke="#94a3b8" />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}
                                labelStyle={{ color: '#94a3b8' }}
                            />
                            <ReferenceLine x="2024" stroke="#64748b" strokeDasharray="3 3">
                                <Label value="Current Year" position="top" fill="#94a3b8" />
                            </ReferenceLine>
                            <ReferenceLine y={6} stroke="#f97316" strokeDasharray="3 3">
                                <Label value="Operational Readiness" position="right" fill="#f97316" />
                            </ReferenceLine>
                            <Line
                                type="monotone"
                                dataKey="trl"
                                stroke="#22d3ee"
                                strokeWidth={3}
                                dot={(props) => {
                                    const { cx, cy, payload } = props;
                                    return (
                                        <circle
                                            cx={cx}
                                            cy={cy}
                                            r={5}
                                            fill={payload.type === 'past' ? '#22d3ee' : '#10b981'}
                                            stroke={payload.type === 'past' ? '#0891b2' : '#059669'}
                                            strokeWidth={2}
                                        />
                                    );
                                }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                    <div className="mt-4 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                        <p className="text-sm text-green-400 font-semibold">
                            📊 Projected operational readiness in **~5-8 years** (by 2029-2032).
                        </p>
                    </div>
                </motion.div>

                {/* SECTION C - Activity-Driven Forecasting */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-slate-900/50 border border-slate-800 rounded-lg p-6 mb-8"
                >
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <Database className="w-5 h-5 text-purple-400" />
                        Cumulative Activity-Driven Forecasting (Patents + Papers + R&D)
                    </h2>
                    <ResponsiveContainer width="100%" height={350}>
                        <AreaChart data={activityChartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                            <XAxis dataKey="year" stroke="#94a3b8" />
                            <YAxis stroke="#94a3b8" />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}
                            />
                            <Area type="monotone" dataKey="patents" stackId="1" stroke="#22d3ee" fill="#22d3ee" fillOpacity={0.6} name="Patents (Cumulative)" />
                            <Area type="monotone" dataKey="papers" stackId="1" stroke="#a855f7" fill="#a855f7" fillOpacity={0.6} name="Papers (Cumulative)" />
                            <Area type="monotone" dataKey="rd" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.6} name="R&D Investment (Millions USD-Equiv, Cumulative)" />
                        </AreaChart>
                    </ResponsiveContainer>
                    <div className="mt-4 p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
                        <p className="text-xs text-slate-400 font-semibold mb-1">AI INTERPRETATION</p>
                        <p className="text-sm text-slate-300">
                            The activity rate has historically been sporadic, but a major investment in 2022 suggests renewed acceleration. The current total activity (Patents: **{latestActivity.patents}**, Papers: **{latestActivity.papers}**, R&D: **${(latestActivity.rdAmount / 1000000).toFixed(1)}M+**) indicates the technology is past basic research and entering an applied development phase.
                        </p>
                    </div>
                </motion.div>

                {/* SECTION D - S-Curve */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-slate-900/50 border border-slate-800 rounded-lg p-6 mb-8"
                >
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-orange-400" />
                        S-Curve (Technology Maturity Curve)
                    </h2>
                    <ResponsiveContainer width="100%" height={350}>
                        <AreaChart data={sCurveChartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                            <XAxis dataKey="year" stroke="#94a3b8" />
                            <YAxis stroke="#94a3b8" label={{ value: 'Maturity %', angle: -90, position: 'insideLeft', fill: '#94a3b8' }} />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}
                            />
                            <ReferenceLine x="2012" stroke="#64748b" strokeDasharray="3 3">
                                <Label value="Early R&D Phase" position="top" fill="#94a3b8" />
                            </ReferenceLine>
                            <ReferenceLine x="2022" stroke="#64748b" strokeDasharray="3 3">
                                <Label value="Growth Acceleration" position="top" fill="#94a3b8" />
                            </ReferenceLine>
                            <ReferenceLine x="2029" stroke="#64748b" strokeDasharray="3 3">
                                <Label value="Rapid Growth" position="top" fill="#94a3b8" />
                            </ReferenceLine>
                            <Area type="monotone" dataKey="adoption" stroke="#f97316" fill="#f97316" fillOpacity={0.4} strokeWidth={3} />
                        </AreaChart>
                    </ResponsiveContainer>
                    <div className="mt-4 p-4 bg-orange-500/10 border border-orange-500/30 rounded-lg">
                        <p className="text-sm text-orange-400 font-semibold">
                            ⚡ Technology is moving into the **Growth Acceleration Zone** (currently ~40% maturity).
                        </p>
                    </div>
                </motion.div>

                {/* SECTION E - Hype Cycle (Retaining original design for Hype Cycle visualization) */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-slate-900/50 border border-slate-800 rounded-lg p-6 mb-8"
                >
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <Activity className="w-5 h-5 text-purple-400" />
                        Hype Cycle Analysis
                    </h2>
                    <div className="relative h-64 flex items-center justify-center">
                        <svg viewBox="0 0 800 200" className="w-full h-full">
                            {/* Hype Cycle Curve */}
                            <path
                                d="M 50 150 Q 150 50, 250 80 Q 300 100, 350 140 Q 500 180, 750 120"
                                stroke="#a855f7"
                                strokeWidth="3"
                                fill="none"
                            />
                            {/* Points (Positioned for a technology passing the Peak) */}
                            <circle cx="150" cy="65" r="6" fill="#22d3ee" />
                            <circle cx="250" cy="80" r="6" fill="#10b981" />
                            <circle cx="350" cy="140" r="6" fill="#f97316" /> {/* Current Position - Trough */}
                            <circle cx="550" cy="165" r="6" fill="#64748b" />
                            <circle cx="750" cy="120" r="6" fill="#64748b" />

                            {/* Labels */}
                            <text x="150" y="50" textAnchor="middle" fill="#94a3b8" fontSize="12">Innovation Trigger</text>
                            <text x="250" y="65" textAnchor="middle" fill="#10b981" fontSize="12">Peak of Expectations</text>
                            <text x="350" y="160" textAnchor="middle" fill="#f97316" fontSize="12" fontWeight="bold">Trough of Disillusionment</text>
                            <text x="550" y="185" textAnchor="middle" fill="#94a3b8" fontSize="12">Slope of Enlightenment</text>
                            <text x="750" y="140" textAnchor="middle" fill="#94a3b8" fontSize="12">Plateau of Productivity</text>
                        </svg>
                    </div>
                    <div className="mt-4 p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                        <p className="text-xs text-slate-400 font-semibold mb-1">AI SAYS</p>
                        <p className="text-sm text-slate-300">
                            Based on the sporadic early activity (2010-2020) followed by a major investment and research paper output (2020-2022), the technology is likely entering the **Trough of Disillusionment** as the focus shifts to resolving engineering challenges from prototype demonstration to operational system, which aligns with TRL 4.5.
                        </p>
                    </div>
                </motion.div>

                {/* SECTION F - Forecast Table */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-slate-900/50 border border-slate-800 rounded-lg p-6 mb-8"
                >
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-cyan-400" />
                        Forecast Table (5–10 Year Prediction)
                    </h2>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-slate-800">
                                    <th className="text-left py-3 px-4 text-slate-400 text-sm">Year</th>
                                    <th className="text-left py-3 px-4 text-slate-400 text-sm">Expected TRL</th>
                                    <th className="text-left py-3 px-4 text-slate-400 text-sm">Patent Growth</th>
                                    <th className="text-left py-3 px-4 text-slate-400 text-sm">Paper Growth</th>
                                    <th className="text-left py-3 px-4 text-slate-400 text-sm">R&D Investment</th>
                                    <th className="text-left py-3 px-4 text-slate-400 text-sm">Risk Level</th>
                                    <th className="text-left py-3 px-4 text-slate-400 text-sm">Notes</th>
                                </tr>
                            </thead>
                            <tbody>
                                {forecastData.map((row, i) => (
                                    <tr key={i} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                                        <td className="py-3 px-4 text-cyan-400 font-semibold">{row.year}</td>
                                        <td className="py-3 px-4 font-semibold">{row.trl}</td>
                                        <td className="py-3 px-4 text-green-400">{row.patentGrowth}</td>
                                        <td className="py-3 px-4 text-purple-400">{row.paperGrowth}</td>
                                        <td className="py-3 px-4">{row.rdInvestment}</td>
                                        <td className="py-3 px-4">
                                            <span className={`px-2 py-1 rounded text-xs font-semibold ${getRiskColor(row.risk)}`}>
                                                {row.risk}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-sm text-slate-400">{row.notes}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </motion.div>

                {/* SECTION G - Signals & Convergence Detection */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="bg-slate-900/50 border border-slate-800 rounded-lg p-6 mb-8"
                >
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 text-orange-400" />
                        Signals & Convergence Detection
                    </h2>
                    <div className="space-y-3">
                        {signals.map((signal, i) => (
                            <div key={i} className="flex items-start gap-3 p-3 bg-slate-800/50 rounded-lg border border-slate-700">
                                {getSignalIcon(signal.type)}
                                <div className="flex-1">
                                    <p className="text-sm text-slate-200">{signal.text}</p>
                                    <p className="text-xs text-slate-400 mt-1">Impact: {signal.impact}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* SECTION H - AI Generated Forecasting Summary */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="bg-gradient-to-br from-cyan-500/10 via-purple-500/10 to-orange-500/10 border border-cyan-500/30 rounded-lg p-6 mb-8"
                >
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <Activity className="w-5 h-5 text-cyan-400" />
                        AI Generated Forecasting Summary
                    </h2>
                    <div className="space-y-4 text-slate-300 leading-relaxed">
                        <p>
                            Supersonic Cruise Missile technology is currently in a critical **Growth Acceleration** phase with an estimated **TRL of {statusMetrics.currentTrl}**. Key activity peaks correspond to early R&D (2010-2013) and recent investment (2022), signaling confidence in moving from prototype to system-level integration.
                        </p>
                        <p>
                            The technology is likely situated in the **Trough of Disillusionment** on the Hype Cycle, meaning major engineering and manufacturing challenges are currently being addressed. The total cumulative public activity points (Patents: **{latestActivity.patents}**, Papers: **{latestActivity.papers}**) are low but concentrated in key development periods, which is typical for strategic, high-cost programs.
                        </p>
                        <p>
                            Forecasting indicates the technology is on track to reach **Operational Readiness (TRL 6) by 2029**. The main risks are the secrecy surrounding large programs in key global players, which can lead to unpredictable technological leaps, making continuous surveillance essential.
                        </p>
                    </div>
                </motion.div>

                {/* SECTION I - Recommendations Panel (Using new dummy recommendations) */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="bg-slate-900/50 border border-slate-800 rounded-lg p-6"
                >
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-400" />
                        Strategic Recommendations
                    </h2>
                    <ul className="space-y-3">
                        {recommendations.map((rec, i) => (
                            <li key={i} className="flex items-start gap-3 text-slate-300">
                                <ChevronRight className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" />
                                <span>{rec}</span>
                            </li>
                        ))}
                    </ul>
                </motion.div>

            </div>
        </div>
    );
};

export default TechForecastingDashboard;