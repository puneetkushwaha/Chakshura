import React, { useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Globe, Target, Database, Cpu, Activity, BarChart3, Building2, Radio, Zap } from 'lucide-react';
import HeroRadarGlobe from '../components/3d/HeroRadarGlobe';

/* --------------------------------------------------------------
   Landing page – Premium AI Defence Intelligence
   -------------------------------------------------------------- */
const LandingPage = () => {
    const navigate = useNavigate();
    const aboutRef = useRef(null);

    const handleChakraAI = () => {
        navigate('/chat');
    };

    const features = [
        { icon: <Database className="w-6 h-6" />, title: "Patent Intelligence", desc: "Deep analysis of global defence patents to predict tech trajectories." },
        { icon: <Cpu className="w-6 h-6" />, title: "TRL Prediction", desc: "AI-driven assessment of Technology Readiness Levels." },
        { icon: <BarChart3 className="w-6 h-6" />, title: "Market Analytics", desc: "Real-time defence market trends and forecasting." },
        { icon: <Activity className="w-6 h-6" />, title: "Hype Cycle Analysis", desc: "Tracking technology maturity curves and adoption phases." },
        { icon: <Building2 className="w-6 h-6" />, title: "Company Intelligence", desc: "Profiling key players in the defence sector." },
        { icon: <Radio className="w-6 h-6" />, title: "Signal Detection", desc: "Early warning system for emerging strategic threats." }
    ];

    return (
        <div className="min-h-screen bg-military-900 text-white overflow-x-hidden font-sans selection:bg-neon-cyan selection:text-military-900">

            {/* --------------------------------------------------------------
                HERO SECTION
            -------------------------------------------------------------- */}
            <section className="relative w-full h-[90vh] overflow-hidden bg-military-900">
                {/* 3D Background */}
                <HeroRadarGlobe />

                {/* Animated overlay */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="bg-grid-pattern absolute inset-0 opacity-20" />
                    <div className="radar-sweep absolute inset-0 opacity-50" />
                </div>

                {/* HUD Elements */}
                <div className="absolute top-8 left-10 flex items-center gap-3 pointer-events-none z-10">
                    <div className="w-2 h-2 bg-neon-orange rounded-full animate-pulse" />
                    <div className="flex flex-col">
                        <div className="text-[10px] font-mono text-gray-500 tracking-widest mb-1">OPERATIONAL STATUS</div>
                        <div className="text-xs font-mono text-neon-orange tracking-widest">LIVE MONITORING // SECURE</div>
                    </div>
                </div>

                {/* Hero Content - LEFT ALIGNED */}
                <div className="absolute inset-0 container mx-auto px-6 h-full flex items-center z-10 pointer-events-none">
                    <div className="max-w-4xl pointer-events-auto mt-0">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            className="flex flex-col gap-8 ml-4 md:ml-24 relative"
                        >
                            {/* Title */}
                            <h1 className="text-5xl md:text-7xl font-military font-bold leading-[0.9] text-white tracking-tight">
                                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-500">
                                    GLOBAL TECH
                                </span>
                                <span className="block text-neon-cyan drop-shadow-[0_0_10px_rgba(0,243,255,0.3)]">
                                    SURVEILLANCE
                                </span>
                            </h1>

                            {/* Subheading */}
                            <p className="text-gray-300 max-w-xl text-lg md:text-xl leading-relaxed pl-6 border-l-4 border-neon-cyan bg-gradient-to-r from-neon-cyan/5 to-transparent py-2">
                                AI-Powered Strategic Foresight & Real-Time Intelligence Radar for <span className="text-white font-bold">Defence Strategy</span>.
                            </p>

                            {/* CHAKRA AI BUTTON */}
                            <div className="flex flex-row gap-4 mt-2">
                                <button
                                    onClick={handleChakraAI}
                                    className="group px-8 py-4 bg-neon-cyan hover:bg-neon-cyan/90 text-military-900 font-bold font-military tracking-wider transition-all uppercase text-sm border-2 border-neon-cyan rounded-none flex items-center gap-3 shadow-[0_0_20px_rgba(0,243,255,0.3)] hover:shadow-[0_0_30px_rgba(0,243,255,0.5)]"
                                >
                                    <Zap className="w-5 h-5 fill-current group-hover:animate-pulse" />
                                    <span>Chakra AI</span>
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Scroll Indicator */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none">
                    <span className="text-[10px] text-gray-500 tracking-[0.3em] uppercase font-mono">SCROLL FOR INTEL</span>
                    <div className="w-[1px] h-12 bg-gradient-to-b from-gray-500 to-transparent" />
                </div>
            </section>

            {/* --------------------------------------------------------------
                FEATURES SECTION
            -------------------------------------------------------------- */}
            <section
                ref={aboutRef}
                className="w-full bg-gradient-to-b from-military-900 to-[#0a1625] py-24 relative z-10"
            >
                <div className="container mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.8 }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl md:text-4xl font-military font-bold text-white mb-4">INTELLIGENCE CAPABILITIES</h2>
                        <div className="w-24 h-1 bg-neon-cyan mx-auto rounded-full"></div>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {features.map((feature, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: idx * 0.1 }}
                                className="group p-8 bg-white/5 border border-white/10 hover:border-neon-cyan/50 rounded-xl backdrop-blur-sm transition-all duration-300 hover:bg-white/10"
                            >
                                <div className="w-12 h-12 bg-neon-cyan/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-neon-cyan/20 transition-colors border border-neon-cyan/20 text-neon-cyan">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3 font-military tracking-wide">{feature.title}</h3>
                                <p className="text-gray-400 text-sm leading-relaxed">
                                    {feature.desc}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --------------------------------------------------------------
                FOOTER
            -------------------------------------------------------------- */}
            <footer className="bg-military-900 border-t border-white/10 py-12">
                <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-neon-cyan rounded-full animate-pulse"></div>
                        <span className="font-military font-bold text-xl tracking-widest text-white">CHAKSHURA</span>
                    </div>
                    <div className="text-gray-500 text-sm">
                        © 2024 Defence Intel Radar. Restricted Access.
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;