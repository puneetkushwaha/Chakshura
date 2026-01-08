import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Globe, TrendingUp, ArrowUpRight, Target, Database, AlertCircle, ChevronRight, BarChart3, FileText, Settings } from 'lucide-react';
import { AreaChart, Area, PieChart, Pie, Cell, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Animated Stat Card Component
const AnimatedStatCard = ({ title, value, change, icon: Icon, color, suffix = '' }) => {
    const [displayValue, setDisplayValue] = useState(0);
    const animationRef = useRef(null);
    const numericValue = parseInt(value.toString().replace(/[^0-9]/g, ''));

    const colorMap = {
        'cyan': { text: 'text-cyan-400', bg: 'bg-cyan-500/10', bar: 'bg-cyan-400' },
        'purple': { text: 'text-purple-400', bg: 'bg-purple-500/10', bar: 'bg-purple-400' },
        'orange': { text: 'text-orange-400', bg: 'bg-orange-500/10', bar: 'bg-orange-400' },
        'green': { text: 'text-green-400', bg: 'bg-green-500/10', bar: 'bg-green-400' }
    };

    const colors = colorMap[color] || colorMap['cyan'];

    useEffect(() => {
        let startTime;
        const duration = 2000;
        const animate = (currentTime) => {
            if (!startTime) startTime = currentTime;
            const progress = Math.min((currentTime - startTime) / duration, 1);
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const currentValue = Math.floor(numericValue * easeOutQuart);
            setDisplayValue(currentValue);
            if (progress < 1) {
                animationRef.current = requestAnimationFrame(animate);
            }
        };
        animationRef.current = requestAnimationFrame(animate);
        return () => {
            if (animationRef.current) cancelAnimationFrame(animationRef.current);
        };
    }, [numericValue]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative bg-slate-900/50 border border-slate-800 rounded-lg p-4 backdrop-blur-sm"
        >
            <div className="flex items-start justify-between mb-3">
                <div className={`p-2 rounded-lg ${colors.bg}`}>
                    <Icon className={`w-5 h-5 ${colors.text}`} />
                </div>
                <span className="text-green-400 text-sm font-mono">+{change}</span>
            </div>
            <p className="text-slate-400 text-xs mb-1">{title}</p>
            <p className={`text-2xl font-bold ${colors.text}`}>
                {displayValue.toLocaleString()}{suffix}
            </p>
        </motion.div>
    );
};

const DEFENSE_TECHNOLOGY_HIERARCHY = [
    {
        name: "Missile Systems",
        subcategories: [
            {
                name: "Cruise Missiles",
                subcategories: [
                    "Supersonic Cruise Missiles",
                    "Subsonic Cruise Missiles",
                    "Sea-skimming Cruise Missiles",
                    "Air-launched Cruise Missiles",
                    "Land-attack Cruise Missiles",
                    "Anti-ship Cruise Missiles"
                ]
            },
            {
                name: "Ballistic Missiles",
                subcategories: [
                    "Short-Range Ballistic Missiles (SRBM)",
                    "Medium-Range Ballistic Missiles (MRBM)",
                    "Intermediate-Range Ballistic Missiles (IRBM)",
                    "Intercontinental Ballistic Missiles (ICBM)",
                    "Manoeuvring Re-entry Vehicles (MARV)"
                ]
            },
            {
                name: "Air-to-Air Missiles",
                subcategories: [
                    "Within Visual Range AAM (WVR)",
                    "Beyond Visual Range AAM (BVR)",
                    "Imaging Infrared AAM",
                    "Active Radar Homing AAM"
                ]
            },
            {
                name: "Surface-to-Air Missiles",
                subcategories: [
                    "Short-Range SAM (SHORAD)",
                    "Medium-Range SAM",
                    "Long-Range SAM",
                    "Ballistic Missile Defence Interceptors"
                ]
            },
            {
                name: "Hypersonic Weapons",
                subcategories: [
                    "Hypersonic Glide Vehicles (HGV)",
                    "Hypersonic Cruise Missiles",
                    "Dual-use Hypersonic Strike Vehicles"
                ]
            }
        ]
    },
    {
        name: "Quantum Technologies",
        subcategories: [
            {
                name: "Quantum Sensing",
                subcategories: [
                    "Quantum Radar / Quantum Illumination",
                    "Quantum Magnetometers",
                    "Quantum Gravimeters",
                    "Quantum Gyroscopes",
                    "Quantum Accelerometers"
                ]
            },
            {
                name: "Quantum Communication",
                subcategories: [
                    "Fiber-based QKD",
                    "Free-Space QKD",
                    "Satellite QKD",
                    "Quantum Secure Networking"
                ]
            },
            {
                name: "Quantum Computing",
                subcategories: [
                    "Quantum Cryptanalysis (PQC Impact)",
                    "Quantum Optimisation (Logistics / Routing)",
                    "Quantum Machine Learning Algorithms",
                    "Quantum Simulation for Defence Materials"
                ]
            }
        ]
    },
    {
        name: "Unmanned & Autonomous Systems",
        subcategories: [
            {
                name: "UAV / Drones",
                subcategories: [
                    "Swarm Drones",
                    "Loitering Munitions",
                    "Long-Endurance UAV (MALE/HALE)",
                    "VTOL / Multirotor UAV",
                    "Stealth UAV",
                    "Cargo / Logistics UAV"
                ]
            },
            {
                name: "UGV (Ground Robots)",
                subcategories: [
                    "Combat UGV",
                    "EOD / IED Disposal UGV",
                    "Reconnaissance UGV",
                    "Logistics UGV",
                    "Autonomous Heavy UGV"
                ]
            },
            {
                name: "USV & UUV (Naval Autonomous Systems)",
                subcategories: [
                    "Unmanned Surface Vessels (USV)",
                    "Autonomous Underwater Vehicles (AUV)",
                    "Remotely Operated Vehicles (ROV)",
                    "Mine Countermeasure Unmanned Systems"
                ]
            }
        ]
    },
    {
        name: "Radar & Sensor Systems",
        subcategories: [
            {
                name: "Radar Systems",
                subcategories: [
                    "Airborne AESA Radar",
                    "Ground-based Air Defence Radar",
                    "Naval Multifunction Radar",
                    "Over-the-Horizon Radar",
                    "Counter-Stealth Radar"
                ]
            },
            {
                name: "EO/IR Sensors",
                subcategories: [
                    "Thermal Imaging Sensors",
                    "FLIR Systems",
                    "Hyperspectral Sensors",
                    "Multispectral Targeting Pods"
                ]
            },
            {
                name: "Electronic / Passive Sensors",
                subcategories: [
                    "ESM Receivers",
                    "ELINT Collectors",
                    "Passive RF Sensors",
                    "Acoustic Sensor Networks"
                ]
            }
        ]
    },
    {
        name: "Electronic Warfare & Cyber",
        subcategories: [
            {
                name: "Electronic Attack",
                subcategories: [
                    "Radar Jammers",
                    "Communication Jammers",
                    "GPS Spoofers & Jammers",
                    "High-Power Microwave Weapons"
                ]
            },
            {
                name: "Electronic Support (ESM/ELINT)",
                subcategories: [
                    "Signal Interception Systems",
                    "Radar Warning Receivers",
                    "Spectrum Monitoring Systems"
                ]
            },
            {
                name: "Cyber Systems",
                subcategories: [
                    "Defensive Cyber Platforms",
                    "Offensive Cyber Toolkits",
                    "Malware / Exploit Frameworks",
                    "ICS/SCADA Security"
                ]
            },
            {
                name: "Spectrum Management",
                subcategories: [
                    "Cognitive Radios",
                    "Anti-jam Communication Systems",
                    "Adaptive Frequency Hopping Networks"
                ]
            }
        ]
    },
    {
        name: "C4ISR & Defence AI",
        subcategories: [
            {
                name: "Battle Management Systems",
                subcategories: [
                    "Integrated Air Defence C2",
                    "Joint Battle Management Systems",
                    "Real-time Command Dashboards"
                ]
            },
            {
                name: "ISR & Multi-sensor Fusion",
                subcategories: [
                    "Target Recognition Systems",
                    "Multi-sensor Fusion Engines",
                    "Automated Battlefield Mapping"
                ]
            },
            {
                name: "Defence AI / ML",
                subcategories: [
                    "Autonomy & Path Planning AI",
                    "Decision Support & Wargaming AI",
                    "Sensor Anomaly Detection AI"
                ]
            }
        ]
    }
];

// Main App Component
const DefenseTechIntelligence = () => {
    const [currentLevel, setCurrentLevel] = useState(1);
    const [breadcrumb, setBreadcrumb] = useState(['Global Overview']);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedSubcategory, setSelectedSubcategory] = useState(null);
    const [selectedTech, setSelectedTech] = useState(null);

    // State for dashboard data
    const [summaryData, setSummaryData] = useState({ patents: 0, papers: 0, investments: 0, avgTrl: 0 });
    const [activityData, setActivityData] = useState([]);
    const [countryActivityData, setCountryActivityData] = useState([]);
    const [loading, setLoading] = useState(true);

    const subcategoryComparison = [
        { name: 'Cruise', activity: 3200 },
        { name: 'Ballistic', activity: 2800 },
        { name: 'Hypersonic', activity: 4100 },
        { name: 'Air-to-Air', activity: 1900 },
        { name: 'Surface-to-Air', activity: 2400 }
    ];

    // Placeholder data for Level 2 (Subcategory)
    const subcategoryActivityData = [
        { year: '2018', patents: 210, papers: 145, investments: 0.8 },
        { year: '2019', patents: 265, papers: 178, investments: 1.2 },
        { year: '2020', patents: 320, papers: 225, investments: 1.6 },
        { year: '2021', patents: 398, papers: 285, investments: 2.1 },
        { year: '2022', patents: 485, papers: 358, investments: 2.8 },
        { year: '2023', patents: 590, papers: 440, investments: 3.5 }
    ];

    const subSubcategoryBreakdown = [
        { name: 'Supersonic', activity: 1200 },
        { name: 'Subsonic', activity: 980 },
        { name: 'Air-launched', activity: 750 },
        { name: 'Sea-skimming', activity: 890 }
    ];

    const trlDistribution = [
        { trl: 'TRL 1-2', count: 45 },
        { trl: 'TRL 3-4', count: 122 },
        { trl: 'TRL 5-6', count: 198 },
        { trl: 'TRL 7-8', count: 87 },
        { trl: 'TRL 9', count: 23 }
    ];

    // Placeholder data for Level 3 (Technology)
    const techActivityData = [
        { year: '2018', patents: 8, papers: 6, rd: 0.5 },
        { year: '2019', patents: 12, papers: 9, rd: 0.8 },
        { year: '2020', patents: 18, papers: 14, rd: 1.2 },
        { year: '2021', patents: 26, papers: 21, rd: 1.8 },
        { year: '2022', patents: 35, papers: 29, rd: 2.5 },
        { year: '2023', patents: 48, papers: 38, rd: 3.2 }
    ];

    const trlProgression = [
        { year: '2016', trl: 2.5 },
        { year: '2018', trl: 3.2 },
        { year: '2020', trl: 4.0 },
        { year: '2022', trl: 4.5 },
        { year: '2024', trl: 5.2 }
    ];

    // Mock data for Technology Level tables
    const patents = [
        { year: '2023', title: 'Advanced variable flow ramjet intake', country: 'US', assignee: 'Raytheon' },
        { year: '2023', title: 'Thermal protection system for hypersonic glide', country: 'CN', assignee: 'CASC' },
        { year: '2022', title: 'Scramjet combustion stability control', country: 'US', assignee: 'Lockheed Martin' },
        { year: '2022', title: 'High-temperature ceramic matrix composites', country: 'FR', assignee: 'Safran' }
    ];

    const papers = [
        { title: 'Computational Fluid Dynamics of Scramjet Inlets', year: '2023', venue: 'J. Propulsion', focus: 'Aerodynamics' },
        { title: 'Heat Transfer Analysis in Hypersonic Flow', year: '2022', venue: 'AIAA Journal', focus: 'Thermal' },
        { title: 'Optimization of Ramjet Nozzle Design', year: '2022', venue: 'Aerospace Sci.', focus: 'Propulsion' }
    ];

    const companies = [
        { name: 'Raytheon Technologies', country: 'US', role: 'System Integration' },
        { name: 'Lockheed Martin', country: 'US', role: 'Airframe / Propulsion' },
        { name: 'MBDA Missile Systems', country: 'EU', role: 'Missile Design' },
        { name: 'CASC', country: 'CN', role: 'Propulsion' }
    ];

    const rdProjects = [
        { name: 'HACM (Hypersonic Attack Cruise Missile)', agency: 'US AFRL', budget: '$1.2B', status: 'Active' },
        { name: 'FC/ASW', agency: 'UK/France MOD', budget: '€800M', status: 'Planning' }
    ];



    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);

                // Build query params
                const params = new URLSearchParams();
                if (selectedCategory) params.append('category', selectedCategory);
                if (selectedSubcategory) params.append('subcategory', selectedSubcategory);
                if (selectedTech) params.append('tech', selectedTech);

                const queryString = params.toString();

                // 1. Fetch Summary
                const sumRes = await fetch(`http://localhost:5001/api/dashboard/summary?${queryString}`);
                const sumJson = await sumRes.json();
                setSummaryData(sumJson);

                // 2. Fetch Activity Trends
                const actRes = await fetch(`http://localhost:5001/api/dashboard/activity?${queryString}`);
                const actJson = await actRes.json();
                setActivityData(actJson);

                // 3. Fetch Country Data
                const geoRes = await fetch(`http://localhost:5001/api/dashboard/geo?${queryString}`);
                const geoJson = await geoRes.json();
                setCountryActivityData(geoJson);

                setLoading(false);
            } catch (err) {
                console.error("Failed to fetch dashboard data", err);
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [selectedCategory, selectedSubcategory, selectedTech]);

    const handleCategoryClick = (category) => {
        console.log("Clicked Category:", category);
        const value = category === "" ? null : category;
        setSelectedCategory(value);
        setSelectedSubcategory(null);
        setSelectedTech(null);
        setCurrentLevel(1);
        setBreadcrumb(value ? [value] : ['Global Overview']);
    };

    const handleSubcategoryClick = (subcategory) => {
        console.log("Clicked Subcategory:", subcategory);
        setSelectedSubcategory(subcategory);
        setSelectedTech(null);
        setCurrentLevel(2);
        setBreadcrumb([selectedCategory, subcategory]);
    };

    const handleTechClick = (tech) => {
        setSelectedTech(tech);
        setCurrentLevel(3);
        setBreadcrumb([selectedCategory, selectedSubcategory, tech]);
    };

    const handleBreadcrumbClick = (index) => {
        const newBreadcrumb = breadcrumb.slice(0, index + 1);
        setBreadcrumb(newBreadcrumb);
        setCurrentLevel(index + 1);

        if (index === 0) {
            setSelectedSubcategory(null);
            setSelectedTech(null);
        } else if (index === 1) {
            setSelectedTech(null);
        }
    };

    // Get current subcategories based on selection
    const currentCategoryObj = DEFENSE_TECHNOLOGY_HIERARCHY.find(c => c.name === selectedCategory);
    const availableSubcategories = currentCategoryObj ? currentCategoryObj.subcategories : [];

    const currentSubcategoryObj = availableSubcategories.find(s => s.name === selectedSubcategory);
    const availableTechs = currentSubcategoryObj ? currentSubcategoryObj.subcategories : [];

    return (
        <div className="min-h-screen bg-slate-950 text-white font-sans">
            {/* Main Content */}
            <div className="w-full">
                {/* Top Bar */}
                <div className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-sm border-b border-slate-800">
                    <div className="flex items-center justify-between px-6 py-4">
                        <div className="flex items-center gap-4">
                            {/* Breadcrumb */}
                            <div className="flex items-center gap-2 text-sm">
                                {breadcrumb.map((item, index) => (
                                    <React.Fragment key={index}>
                                        <button
                                            onClick={() => handleBreadcrumbClick(index)}
                                            className={`hover:text-cyan-400 transition-colors ${index === breadcrumb.length - 1 ? 'text-cyan-400' : 'text-slate-400'
                                                }`}
                                        >
                                            {item}
                                        </button>
                                        {index < breadcrumb.length - 1 && (
                                            <ChevronRight className="w-4 h-4 text-slate-600" />
                                        )}
                                    </React.Fragment>
                                ))}
                            </div>
                        </div>

                        {/* Category Selector (Top Level Switcher) */}
                        <div className="flex items-center gap-4">
                            <select
                                className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-sm max-w-[200px]"
                                value={selectedCategory || ""}
                                onChange={(e) => handleCategoryClick(e.target.value)}
                            >
                                <option value="">Global Overview</option>
                                {DEFENSE_TECHNOLOGY_HIERARCHY.map(cat => (
                                    <option key={cat.name} value={cat.name}>{cat.name}</option>
                                ))}
                            </select>
                            <select className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-sm">
                                <option>Last 10 years</option>
                                <option>All time</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Content Area */}
                <div className="p-6">
                    <AnimatePresence mode="wait">
                        {currentLevel === 1 && (
                            <motion.div
                                key="level1"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                            >
                                {/* Level 1: Category Dashboard */}
                                <div className="mb-6">
                                    <h2 className="text-3xl font-bold mb-2">{selectedCategory} — Strategic Overview</h2>
                                    <p className="text-slate-400">Total subcategories: 6 | Total technologies: 18</p>
                                </div>

                                {/* Summary Cards */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                                    <AnimatedStatCard
                                        title="Total Patents"
                                        value={summaryData.patents}
                                        change="--"
                                        icon={Database}
                                        color="cyan"
                                    />
                                    <AnimatedStatCard
                                        title="Research Papers"
                                        value={summaryData.papers}
                                        change="--"
                                        icon={FileText}
                                        color="purple"
                                    />
                                    <AnimatedStatCard
                                        title="R&D Investments"
                                        value={summaryData.investments}
                                        suffix="M"
                                        change="--"
                                        icon={TrendingUp}
                                        color="orange"
                                    />
                                    <AnimatedStatCard
                                        title="Average TRL"
                                        value={summaryData.avgTrl}
                                        change="--"
                                        icon={Target}
                                        color="green"
                                    />
                                </div>

                                {/* Charts */}
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                                    {/* Activity Over Time */}
                                    <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-6">
                                        <h3 className="text-lg font-semibold mb-4 text-cyan-400">Activity Over Time</h3>
                                        <ResponsiveContainer width="100%" height={250}>
                                            <LineChart data={activityData}>
                                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                                <XAxis dataKey="year" stroke="#94a3b8" />
                                                <YAxis stroke="#94a3b8" />
                                                <Tooltip
                                                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}
                                                />
                                                <Line type="monotone" dataKey="patents" stroke="#22d3ee" strokeWidth={2} />
                                                <Line type="monotone" dataKey="papers" stroke="#a855f7" strokeWidth={2} />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>

                                    {/* Subcategory Comparison (Keep placeholder for now as per plan, or update if we had API) */}
                                    <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-6">
                                        <h3 className="text-lg font-semibold mb-4 text-cyan-400">Subcategory Comparison</h3>
                                        <ResponsiveContainer width="100%" height={250}>
                                            <BarChart data={subcategoryComparison}>
                                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                                <XAxis dataKey="name" stroke="#94a3b8" />
                                                <YAxis stroke="#94a3b8" />
                                                <Tooltip
                                                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}
                                                />
                                                <Bar dataKey="activity" fill="#22d3ee" />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>

                                {/* Country Activity */}
                                <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-6 mb-8">
                                    <h3 className="text-lg font-semibold mb-4 text-cyan-400">Country Activity</h3>
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead>
                                                <tr className="border-b border-slate-800">
                                                    <th className="text-left py-3 text-slate-400">Country</th>
                                                    <th className="text-left py-3 text-slate-400">Patents</th>
                                                    <th className="text-left py-3 text-slate-400">Companies</th>
                                                    <th className="text-left py-3 text-slate-400">Most Active</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {countryActivityData.map((item, i) => (
                                                    <tr key={i} className="border-b border-slate-800/50">
                                                        <td className="py-3 font-semibold">{item.country}</td>
                                                        <td className="py-3 text-cyan-400">{item.patents}</td>
                                                        <td className="py-3">{item.companies}</td>
                                                        <td className="py-3 text-sm text-slate-400">--</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                {/* Subcategory List */}
                                <div className="mb-8">
                                    <h3 className="text-xl font-semibold mb-4">
                                        {availableSubcategories.length > 0 ? "Subcategories" : "Technology Domains"}
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {(availableSubcategories.length > 0 ? availableSubcategories : DEFENSE_TECHNOLOGY_HIERARCHY).map((item) => (
                                            <motion.button
                                                key={item.name}
                                                onClick={() => {
                                                    const isSub = availableSubcategories.length > 0;
                                                    console.log("Button Click:", item.name, "Is Subcategory View?", isSub);
                                                    if (isSub) {
                                                        handleSubcategoryClick(item.name);
                                                    } else {
                                                        handleCategoryClick(item.name);
                                                    }
                                                }}
                                                whileHover={{ scale: 1.02 }}
                                                className="bg-slate-900 border border-slate-800 rounded-lg p-4 text-left hover:border-cyan-500/50 transition-all"
                                            >
                                                <h4 className="font-semibold mb-2">{item.name}</h4>
                                                <div className="flex items-center justify-between text-sm text-slate-400">
                                                    <span>View Intelligence</span>
                                                    <span className="text-green-400">↑ Drill down</span>
                                                </div>
                                            </motion.button>
                                        ))}
                                    </div>
                                </div>

                                {/* AI Summary */}
                                <div className="bg-gradient-to-br from-cyan-500/10 to-purple-500/10 border border-cyan-500/30 rounded-lg p-6">
                                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                                        <Activity className="w-5 h-5 text-cyan-400" />
                                        AI Intelligence Summary
                                    </h3>
                                    <p className="text-slate-300 leading-relaxed">
                                        Overall activity in Missile Systems is increasing at ~18% per year, driven mainly by hypersonic and cruise missile research. North America and East Asia dominate patents and investments. TRL levels suggest multiple systems are in advanced testing and early deployment. Key growth areas include hypersonic glide vehicles, long-range precision strike, and AI-guided targeting systems.
                                    </p>
                                </div>
                            </motion.div>
                        )}

                        {currentLevel === 2 && (
                            <motion.div
                                key="level2"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                            >
                                {/* Level 2: Subcategory Dashboard */}
                                <div className="mb-6">
                                    <h2 className="text-3xl font-bold mb-2">{selectedSubcategory} — Domain Overview</h2>
                                    <p className="text-slate-400">Sub-technologies: 4 | Active companies: 82</p>
                                </div>

                                {/* Summary Cards */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                                    <AnimatedStatCard
                                        title="Total Patents"
                                        value={3240}
                                        change="21%"
                                        icon={Database}
                                        color="cyan"
                                    />
                                    <AnimatedStatCard
                                        title="Research Papers"
                                        value={1520}
                                        change="18%"
                                        icon={FileText}
                                        color="purple"
                                    />
                                    <AnimatedStatCard
                                        title="Investments"
                                        value="8.3"
                                        suffix="B"
                                        change="22%"
                                        icon={TrendingUp}
                                        color="orange"
                                    />
                                    <AnimatedStatCard
                                        title="Average TRL"
                                        value="5.8"
                                        change="12%"
                                        icon={Target}
                                        color="green"
                                    />
                                </div>

                                {/* Charts */}
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                                    {/* Subcategory Activity */}
                                    <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-6">
                                        <h3 className="text-lg font-semibold mb-4 text-cyan-400">Activity Trends</h3>
                                        <ResponsiveContainer width="100%" height={250}>
                                            <AreaChart data={subcategoryActivityData}>
                                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                                <XAxis dataKey="year" stroke="#94a3b8" />
                                                <YAxis stroke="#94a3b8" />
                                                <Tooltip
                                                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}
                                                />
                                                <Area type="monotone" dataKey="patents" stackId="1" stroke="#22d3ee" fill="#22d3ee" fillOpacity={0.6} />
                                                <Area type="monotone" dataKey="papers" stackId="1" stroke="#a855f7" fill="#a855f7" fillOpacity={0.6} />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>

                                    {/* Sub-subcategory Breakdown */}
                                    <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-6">
                                        <h3 className="text-lg font-semibold mb-4 text-cyan-400">Technology Breakdown</h3>
                                        <ResponsiveContainer width="100%" height={250}>
                                            <BarChart data={subSubcategoryBreakdown}>
                                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                                <XAxis dataKey="name" stroke="#94a3b8" />
                                                <YAxis stroke="#94a3b8" />
                                                <Tooltip
                                                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}
                                                />
                                                <Bar dataKey="activity" fill="#a855f7" />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>

                                {/* TRL Distribution */}
                                <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-6 mb-8">
                                    <h3 className="text-lg font-semibold mb-4 text-cyan-400">TRL Distribution</h3>
                                    <ResponsiveContainer width="100%" height={200}>
                                        <BarChart data={trlDistribution} layout="vertical">
                                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                            <XAxis type="number" stroke="#94a3b8" />
                                            <YAxis dataKey="trl" type="category" stroke="#94a3b8" />
                                            <Tooltip
                                                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}
                                            />
                                            <Bar dataKey="count" fill="#10b981" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>

                                {/* Sub-sub Technologies */}
                                <div className="mb-8">
                                    <h3 className="text-xl font-semibold mb-4">Technologies</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {availableTechs.map((tech) => (
                                            <motion.button
                                                key={tech}
                                                onClick={() => handleTechClick(tech)}
                                                whileHover={{ scale: 1.02 }}
                                                className="bg-slate-900 border border-slate-800 rounded-lg p-4 text-left hover:border-purple-500/50 transition-all"
                                            >
                                                <h4 className="font-semibold mb-2">{tech}</h4>
                                                <div className="grid grid-cols-3 gap-2 text-sm text-slate-400 mb-2">
                                                    <div>Click to analyze</div>
                                                </div>
                                                <span className="inline-block px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded">Deep Dive</span>
                                            </motion.button>
                                        ))}
                                    </div>
                                </div>

                                {/* AI Summary */}
                                <div className="bg-gradient-to-br from-purple-500/10 to-cyan-500/10 border border-purple-500/30 rounded-lg p-6">
                                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                                        <Activity className="w-5 h-5 text-purple-400" />
                                        AI Intelligence Summary
                                    </h3>
                                    <p className="text-slate-300 leading-relaxed">
                                        Cruise Missiles domain shows strong growth with supersonic and sea-skimming variants driving most recent innovation. TRL levels suggest active prototyping and early deployment across multiple navies. Investments correlate strongly with research spikes, especially in the 2018-2023 window. This domain is critical for long-range precision strike capabilities.
                                    </p>
                                </div>
                            </motion.div>
                        )}

                        {currentLevel === 3 && (
                            <motion.div
                                key="level3"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                            >
                                {/* Level 3: Technology Dashboard */}
                                <div className="mb-6">
                                    <h2 className="text-3xl font-bold mb-2">{selectedTech} — Technology Intelligence</h2>
                                    <p className="text-slate-400">Deep analysis of specific technology development</p>
                                </div>

                                {/* Summary Cards */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
                                    <AnimatedStatCard
                                        title="Patents"
                                        value={122}
                                        change="21%"
                                        icon={Database}
                                        color="cyan"
                                    />
                                    <AnimatedStatCard
                                        title="Research Papers"
                                        value={87}
                                        change="18%"
                                        icon={FileText}
                                        color="purple"
                                    />
                                    <AnimatedStatCard
                                        title="Companies"
                                        value={12}
                                        change="15%"
                                        icon={Globe}
                                        color="orange"
                                    />
                                    <AnimatedStatCard
                                        title="Current TRL"
                                        value="4.5"
                                        change="8%"
                                        icon={Target}
                                        color="green"
                                    />
                                    <div className="bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-500/50 rounded-lg p-4 flex flex-col justify-center items-center">
                                        <AlertCircle className="w-8 h-8 text-cyan-400 mb-2" />
                                        <p className="text-xs text-slate-300 text-center">Emerging Tech</p>
                                        <p className="text-sm font-bold text-cyan-400">High Impact</p>
                                    </div>
                                </div>

                                {/* Time Series & S-Curve */}
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                                    <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-6">
                                        <h3 className="text-lg font-semibold mb-4 text-cyan-400">Activity Time-Series</h3>
                                        <ResponsiveContainer width="100%" height={250}>
                                            <LineChart data={techActivityData}>
                                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                                <XAxis dataKey="year" stroke="#94a3b8" />
                                                <YAxis stroke="#94a3b8" />
                                                <Tooltip
                                                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}
                                                />
                                                <Line type="monotone" dataKey="patents" stroke="#22d3ee" strokeWidth={2} />
                                                <Line type="monotone" dataKey="papers" stroke="#a855f7" strokeWidth={2} />
                                                <Line type="monotone" dataKey="rd" stroke="#10b981" strokeWidth={2} />
                                            </LineChart>
                                        </ResponsiveContainer>
                                        <p className="text-xs text-slate-400 mt-2">Average growth: 18-22% per year</p>
                                    </div>

                                    <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-6">
                                        <h3 className="text-lg font-semibold mb-4 text-cyan-400">TRL Progression</h3>
                                        <ResponsiveContainer width="100%" height={250}>
                                            <LineChart data={trlProgression}>
                                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                                <XAxis dataKey="year" stroke="#94a3b8" />
                                                <YAxis domain={[0, 9]} stroke="#94a3b8" />
                                                <Tooltip
                                                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}
                                                />
                                                <Line type="monotone" dataKey="trl" stroke="#f97316" strokeWidth={3} />
                                            </LineChart>
                                        </ResponsiveContainer>
                                        <div className="mt-4 p-3 bg-orange-500/10 border border-orange-500/30 rounded text-xs">
                                            <p className="text-orange-400 font-semibold mb-1">Forecast</p>
                                            <p className="text-slate-300">Expected TRL 6 by 2028 • TRL 7 by 2031</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Ecosystem Data Tables */}
                                <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-6 mb-8">
                                    <h3 className="text-lg font-semibold mb-4 text-cyan-400">Ecosystem View</h3>

                                    {/* Tabs */}
                                    <div className="flex gap-2 mb-6 border-b border-slate-800">
                                        {['Patents', 'Papers', 'Companies', 'R&D'].map((tab) => (
                                            <button
                                                key={tab}
                                                className="px-4 py-2 text-sm font-medium text-cyan-400 border-b-2 border-cyan-400"
                                            >
                                                {tab}
                                            </button>
                                        ))}
                                    </div>

                                    {/* Patents Table */}
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead>
                                                <tr className="border-b border-slate-800">
                                                    <th className="text-left py-3 text-slate-400 text-sm">Year</th>
                                                    <th className="text-left py-3 text-slate-400 text-sm">Title</th>
                                                    <th className="text-left py-3 text-slate-400 text-sm">Country</th>
                                                    <th className="text-left py-3 text-slate-400 text-sm">Assignee</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {patents.map((patent, i) => (
                                                    <tr key={i} className="border-b border-slate-800/50 hover:bg-slate-800/30">
                                                        <td className="py-3 text-cyan-400">{patent.year}</td>
                                                        <td className="py-3 text-sm">{patent.title}</td>
                                                        <td className="py-3">{patent.country}</td>
                                                        <td className="py-3 text-sm text-slate-400">{patent.assignee}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                {/* Papers Section */}
                                <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-6 mb-8">
                                    <h3 className="text-lg font-semibold mb-4 text-purple-400">Research Papers</h3>
                                    <div className="space-y-4">
                                        {papers.map((paper, i) => (
                                            <div key={i} className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                                                <div className="flex items-start justify-between mb-2">
                                                    <h4 className="font-medium text-sm flex-1">{paper.title}</h4>
                                                    <span className="text-xs text-slate-400 ml-4">{paper.year}</span>
                                                </div>
                                                <div className="flex gap-4 text-xs text-slate-400">
                                                    <span>Venue: {paper.venue}</span>
                                                    <span>Focus: {paper.focus}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Companies & R&D */}
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                                    <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-6">
                                        <h3 className="text-lg font-semibold mb-4 text-orange-400">Key Companies</h3>
                                        <div className="space-y-3">
                                            {companies.map((company, i) => (
                                                <div key={i} className="p-3 bg-slate-800/50 rounded border border-slate-700">
                                                    <div className="font-medium text-sm mb-1">{company.name}</div>
                                                    <div className="text-xs text-slate-400">{company.country} • {company.role}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-6">
                                        <h3 className="text-lg font-semibold mb-4 text-green-400">R&D Projects</h3>
                                        <div className="space-y-3">
                                            {rdProjects.map((project, i) => (
                                                <div key={i} className="p-3 bg-slate-800/50 rounded border border-slate-700">
                                                    <div className="flex justify-between items-start mb-1">
                                                        <span className="text-xs text-green-400">{project.year}</span>
                                                        <span className="text-sm font-bold text-green-400">{project.amount}</span>
                                                    </div>
                                                    <div className="text-sm mb-1">{project.title}</div>
                                                    <div className="text-xs text-slate-400">Agency: {project.agency}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* AI Summary - Deep */}
                                <div className="bg-gradient-to-br from-cyan-500/10 via-purple-500/10 to-orange-500/10 border border-cyan-500/30 rounded-lg p-6">
                                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                                        <Activity className="w-5 h-5 text-cyan-400" />
                                        AI Intelligence Brief — {selectedTech}
                                    </h3>
                                    <p className="text-slate-300 leading-relaxed mb-4">
                                        Activity in this technology has steadily increased since 2018, with notable spikes in patents and research focused on guidance and ramjet propulsion. Current estimated TRL is ~4.5, indicating advanced prototypes and limited testing phases.
                                    </p>
                                    <p className="text-slate-300 leading-relaxed mb-4">
                                        R&D investments, such as the 2019 $12M grant for guidance system development in India, signal growing strategic importance. Multiple defense contractors are actively pursuing variations of this technology, particularly focusing on sea-skimming capabilities and thermal management.
                                    </p>
                                    <p className="text-slate-300 leading-relaxed">
                                        <span className="text-cyan-400 font-semibold">Recommendation:</span> If current trends continue, operational-level deployments based on this technology are likely within the next 6-10 years. Continuous monitoring of guidance algorithm research and propulsion material improvements is advised.
                                    </p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default DefenseTechIntelligence;