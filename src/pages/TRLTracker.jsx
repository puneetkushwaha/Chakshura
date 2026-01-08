// frontend/src/pages/TRLTracker.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Shield, AlertCircle, Loader2 } from "lucide-react";
import { useTRL } from "../hooks/useTRL"; // 👈 path adjust if needed

const TRLCard = ({ title, level, progress, status, description }) => (
  <motion.div
    whileHover={{ y: -5 }}
    className="bg-glass-dark border border-white/10 rounded-xl p-6 relative overflow-hidden"
  >
    <div className="absolute top-0 right-0 p-4 opacity-5">
      <Shield className="w-24 h-24" />
    </div>

    <div className="flex justify-between items-start mb-4">
      <div>
        <span className="text-xs font-mono text-neon-cyan tracking-wider">
          TRL {level}
        </span>
        <h3 className="text-lg font-bold text-white mt-1">{title}</h3>
      </div>
      <div
        className={`px-2 py-1 rounded text-xs font-bold ${
          status === "MATURE"
            ? "bg-neon-green/10 text-neon-green"
            : status === "DEVELOPMENT"
            ? "bg-neon-orange/10 text-neon-orange"
            : "bg-neon-blue/10 text-neon-blue"
        }`}
      >
        {status}
      </div>
    </div>

    <p className="text-gray-400 text-sm mb-6 h-10 line-clamp-2">
      {description}
    </p>

    <div className="space-y-2">
      <div className="flex justify-between text-xs text-gray-400">
        <span>MATURITY LEVEL</span>
        <span>{progress}%</span>
      </div>
      <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1, delay: 0.2 }}
          className={`h-full rounded-full ${
            progress > 80
              ? "bg-neon-green"
              : progress > 50
              ? "bg-neon-cyan"
              : "bg-neon-orange"
          }`}
        />
      </div>
    </div>
  </motion.div>
);

const TRLTracker = () => {
  const [techInput, setTechInput] = useState("Hypersonic propulsion");
  const { loading, data, error, getTRL } = useTRL();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!techInput.trim()) return;
    getTRL(techInput.trim());
  };

  const trlScore = data?.trl_score || 1;
  const computedProgress = Math.round((trlScore / 9) * 100);

  const aiDescription = data
    ? `AI-assessed TRL for ${data.technology} is ${data.trl_score} (${data.status}).`
    : "Run AI assessment to see TRL score, reasoning and technology maturity.";

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-military font-bold text-white">
            TECH READINESS (TRL)
          </h1>
          <p className="text-gray-400 text-xs sm:text-sm font-mono">
            MATURITY LEVEL ASSESSMENT · AI-POWERED
          </p>
        </div>

        {/* AI query input */}
        <form
          onSubmit={handleSubmit}
          className="flex gap-2 items-center w-full sm:w-auto"
        >
          <input
            type="text"
            value={techInput}
            onChange={(e) => setTechInput(e.target.value)}
            placeholder="Enter technology (e.g. Hypersonic propulsion)"
            className="flex-1 sm:w-80 bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs sm:text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-neon-cyan/60"
          />
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg bg-neon-cyan text-military-900 text-xs sm:text-sm font-semibold hover:bg-neon-cyan/90 transition disabled:opacity-60"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            <span>{loading ? "Analyzing..." : "Run AI"}</span>
          </button>
        </form>
      </div>

      {/* TRL Scale Legend */}
      <div className="flex justify-between items-center bg-white/5 p-4 rounded-xl border border-white/10 overflow-x-auto">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((level) => (
          <div
            key={level}
            className="flex flex-col items-center gap-2 min-w-[60px]"
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                level <= trlScore
                  ? "bg-neon-cyan text-military-900"
                  : "bg-gray-700 text-gray-400"
              }`}
            >
              {level}
            </div>
            <span className="text-[10px] text-gray-500 font-mono">
              LEVEL {level}
            </span>
          </div>
        ))}
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 text-red-400 text-xs bg-red-500/10 border border-red-500/40 p-3 rounded-lg">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      {/* Cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* AI-driven main card */}
        <TRLCard
          title={data?.technology || "Hypersonic Glide Vehicle"}
          level={trlScore}
          progress={computedProgress}
          status={data?.status || "RESEARCH"}
          description={aiDescription}
        />

        {/* Static example cards (tumhara original demo data) */}
        <TRLCard
          title="Quantum Encryption Chip"
          level="4"
          progress={40}
          status="RESEARCH"
          description="On-chip quantum key distribution system for secure communications."
        />
        <TRLCard
          title="Autonomous Swarm Drones"
          level="8"
          progress={85}
          status="MATURE"
          description="Coordinated multi-agent drone systems for surveillance and reconnaissance."
        />
        <TRLCard
          title="Solid State Battery"
          level="5"
          progress={55}
          status="DEVELOPMENT"
          description="High energy density storage for extended mission duration."
        />
        <TRLCard
          title="Cognitive EW Suite"
          level="7"
          progress={75}
          status="MATURE"
          description="AI-driven electronic warfare system for adaptive threat response."
        />
        <TRLCard
          title="Bio-Synthetic Armor"
          level="3"
          progress={25}
          status="RESEARCH"
          description="Self-healing material properties for next-gen personnel protection."
        />
      </div>
    </div>
  );
};

export default TRLTracker;
