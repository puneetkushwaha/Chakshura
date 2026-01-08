import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, Mail, Lock, ArrowRight, FileText } from "lucide-react";
import CyberBackground from "../components/ui/CyberBackground";
import { toast } from "react-hot-toast";

import { useAuth } from "../context/AuthContext";

const SignupPage = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();

  const [isLoading, setIsLoading] = useState(false);

  // FORM STATE
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [department, setDepartment] = useState("Strategic Analysis");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // 1️⃣ AuthContext → creates user + profile in Firestore
      await signup(email, password, {
        firstName,
        lastName,
        department, // "Strategic Analysis" / "Scientist" / "admin"
      });

      toast.success("Account created! Please log in.");

      setIsLoading(false);
      navigate("/login");
    } catch (error) {
      console.error("Signup failed:", error);

      if (error.code === "auth/email-already-in-use") {
        toast.error("Email already registered. Please log in.");
      } else if (error.code === "auth/invalid-email") {
        toast.error("Invalid email address.");
      } else if (error.code === "auth/weak-password") {
        toast.error("Password must be at least 6 characters.");
      } else if (
        error.message &&
        error.message.toLowerCase().includes("missing or insufficient permissions")
      ) {
        toast.error("Firestore rules are blocking signup. Check Firestore rules.");
      } else {
        toast.error(error.message || "Signup failed.");
      }

      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-[#050b14] p-4">
      <CyberBackground />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-2xl"
      >
        <div className="relative bg-[#0f172a]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-8 md:p-10 shadow-2xl">
          {/* Corners */}
          <div className="absolute -top-2 -left-2 w-6 h-6 border-l-2 border-t-2 border-neon-cyan rounded-tl-lg" />
          <div className="absolute -bottom-2 -right-2 w-6 h-6 border-r-2 border-b-2 border-neon-cyan rounded-br-lg" />

          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 mb-4 bg-[#0a1625] rounded-full border border-white/10 shadow-[0_0_15px_rgba(0,243,255,0.1)]">
              <Shield className="w-8 h-8 text-neon-cyan" />
            </div>
            <h2 className="text-xl sm:text-2xl font-military font-bold text-white tracking-wider mb-1">
              REQUEST CLEARANCE
            </h2>
            <p className="text-[10px] font-mono text-neon-cyan tracking-[0.2em] uppercase">
              NEW OPERATIVE REGISTRATION // LEVEL 1
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSignup} className="space-y-6">
            {/* Name row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-mono text-gray-400 tracking-widest uppercase ml-1">
                  First Name
                </label>
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full bg-[#0a1625] border border-white/10 text-white text-sm rounded-lg focus:ring-1 focus:ring-neon-cyan focus:border-neon-cyan block w-full p-3 placeholder-gray-600 font-mono transition-all"
                  placeholder="JOHN"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-mono text-gray-400 tracking-widest uppercase ml-1">
                  Last Name
                </label>
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full bg-[#0a1625] border border-white/10 text-white text-sm rounded-lg focus:ring-1 focus:ring-neon-cyan focus:border-neon-cyan block w-full p-3 placeholder-gray-600 font-mono transition-all"
                  placeholder="DOE"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-[10px] font-mono text-gray-400 tracking-widest uppercase ml-1">
                Official Email
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-gray-500 group-focus-within:text-neon-cyan transition-colors" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#0a1625] border border-white/10 text-white text-sm rounded-lg focus:ring-1 focus:ring-neon-cyan focus:border-neon-cyan block w-full pl-10 p-3 placeholder-gray-600 font-mono transition-all"
                  placeholder="operator@chakshura.drdo"
                />
              </div>
            </div>

            {/* Department */}
            <div className="space-y-2">
              <label className="text-[10px] font-mono text-gray-400 tracking-widest uppercase ml-1">
                Department
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FileText className="h-4 w-4 text-gray-500 group-focus-within:text-neon-cyan transition-colors" />
                </div>
                <select
                  required
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full bg-[#0a1625] border border-white/10 text-white text-sm rounded-lg focus:ring-1 focus:ring-neon-cyan focus:border-neon-cyan block w-full pl-10 p-3 font-mono transition-all appearance-none"
                >
                  <option>Strategic Analysis</option>
                  <option>Scientist</option>
                  <option>admin</option>
                </select>
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-[10px] font-mono text-gray-400 tracking-widest uppercase ml-1">
                Set Password
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-gray-500 group-focus-within:text-neon-cyan transition-colors" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#0a1625] border border-white/10 text-white text-sm rounded-lg focus:ring-1 focus:ring-neon-cyan focus:border-neon-cyan block w-full pl-10 p-3 placeholder-gray-600 font-mono transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full group relative py-3 px-4 bg-transparent border border-neon-cyan/50 text-neon-cyan font-bold font-military tracking-wider hover:bg-neon-cyan hover:text-[#050b14] transition-all duration-300 rounded-lg mt-8 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <div className="flex items-center justify-center gap-2">
                <span>{isLoading ? "PROCESSING..." : "SUBMIT REQUEST"}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-[10px] text-gray-500 font-mono">
              ALREADY HAVE CLEARANCE?{" "}
              <Link
                to="/login"
                className="text-neon-cyan hover:underline decoration-neon-cyan/50 underline-offset-4"
              >
                ACCESS TERMINAL
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SignupPage;
