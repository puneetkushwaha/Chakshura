// src/pages/LoginPage.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import { Shield, Lock, User, ArrowRight, Loader2 } from "lucide-react";
import CyberBackground from "../components/ui/CyberBackground";
import { toast } from "react-hot-toast";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Invalid email format";

    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Fix the errors before submitting.");
      return;
    }

    setIsLoading(true);
    const loadingId = toast.loading("Authenticating...");

    try {
      await login(formData.email, formData.password);

      toast.dismiss(loadingId);
      toast.success("Access Granted");
      navigate("/dashboard");
    } catch (error) {
      console.error("Login error:", error);

      toast.dismiss(loadingId);

      let msg = "Authentication failed";

      if (error.code === "auth/user-not-found")
        msg = "No user found with this email";
      else if (error.code === "auth/wrong-password") msg = "Wrong password";
      else if (error.code === "auth/invalid-email") msg = "Invalid email";

      toast.error(msg);
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
        className="relative z-10 w-full max-w-[480px]"
      >
        <div className="bg-[#0f172a] border border-white/10 rounded-xl p-6 sm:p-8 backdrop-blur-xl relative overflow-hidden">
          {/* Corner Accents */}
          <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-neon-cyan rounded-tl-xl" />
          <div className="absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 border-neon-cyan rounded-tr-xl" />
          <div className="absolute bottom-0 left-0 w-12 h-12 border-b-2 border-l-2 border-neon-cyan rounded-bl-xl" />
          <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-neon-cyan rounded-br-xl" />

          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="w-14 h-14 bg-neon-cyan/10 rounded-lg flex items-center justify-center border border-neon-cyan/20">
                <Shield className="w-7 h-7 text-neon-cyan" />
              </div>
            </div>
            <h2 className="text-xl sm:text-2xl font-military font-bold text-white tracking-wider mb-2">
              SECURE ACCESS
            </h2>
            <p className="text-xs text-gray-500 font-mono tracking-widest">
              RESTRICTED AREA // AUTHORIZED ONLY
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email */}
            <div className="relative">
              <label className="text-xs text-gray-400 font-mono tracking-wider mb-2 block uppercase">
                <User className="w-3 h-3 inline mr-1" />
                Operator ID
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full bg-[#0a1625] border ${
                  errors.email ? "border-red-500/50" : "border-white/10"
                } text-white px-4 py-3 rounded-lg focus:outline-none focus:border-neon-cyan transition-colors font-mono text-sm`}
                placeholder="operator@chakshura.drdo"
              />
              {errors.email && (
                <p className="text-xs text-red-400 mt-1 font-mono">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="relative">
              <label className="text-xs text-gray-400 font-mono tracking-wider mb-2 block uppercase">
                <Lock className="w-3 h-3 inline mr-1" />
                Access Code
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full bg-[#0a1625] border ${
                  errors.password ? "border-red-500/50" : "border-white/10"
                } text-white px-4 py-3 rounded-lg focus:outline-none focus:border-neon-cyan transition-colors font-mono text-sm`}
                placeholder="••••••••"
              />
              {errors.password && (
                <p className="text-xs text-red-400 mt-1 font-mono">
                  {errors.password}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-transparent border-2 border-neon-cyan text-neon-cyan py-3 rounded-lg font-military font-bold text-sm tracking-wider hover:bg-neon-cyan hover:text-military-900 transition-all uppercase flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  AUTHENTICATING...
                </>
              ) : (
                <>
                  INITIATE LOGIN
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="text-center mt-6 pt-6 border-t border-white/10">
            <p className="text-xs text-gray-500 font-mono">
              NEW OPERATIVE?{" "}
              <Link
                to="/signup"
                className="text-neon-cyan hover:underline font-bold"
              >
                REQUEST CLEARANCE
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
