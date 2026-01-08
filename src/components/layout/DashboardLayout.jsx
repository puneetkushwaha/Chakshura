import React, { useState, useEffect } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  Activity,
  Settings,
  Bell,
  Search,
  Menu,
  X,
  LogOut,
  Shield,
  Network,
  Printer,
  TrendingUp,
  Layers,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";
import { useAuth } from "../../context/AuthContext";

const SidebarItem = ({ icon: Icon, label, path, isActive, isCollapsed }) => (
  <Link
    to={path}
    className={clsx(
      "flex items-center gap-3 px-4 py-3 my-1 rounded-lg transition-all duration-300 group relative overflow-hidden",
      isActive
        ? "bg-neon-cyan/10 text-neon-cyan border-r-2 border-neon-cyan"
        : "text-gray-400 hover:text-white hover:bg-white/5"
    )}
  >
    <Icon className={clsx("w-5 h-5 min-w-[20px]", isActive && "animate-pulse")} />
    {!isCollapsed && (
      <span className="font-mono text-sm tracking-wide whitespace-nowrap">
        {label}
      </span>
    )}
    {isActive && (
      <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan/5 to-transparent pointer-events-none" />
    )}
  </Link>
);

const DashboardLayout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const { user, profile, logout } = useAuth();

  // 🔒 If no user, push back to login (extra safety)
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  // 🧠 Normalize values from profile (avoid case / spacing issues)
  const departmentRaw = profile?.department || "";
  const roleRaw = profile?.role || "";

  const department = departmentRaw.trim().toLowerCase(); // "strategic analysis" | "scientist" | "admin"
  const role = roleRaw.trim().toLowerCase();             // "user" | "admin" | etc.

  // 🧭 Define the full menu set
  const allMenuItems = [
    { id: "dashboard", icon: LayoutDashboard, label: "Mission Control", path: "/dashboard" },
    { id: "patents", icon: FileText, label: "Patent Intel", path: "/patents" },
    { id: "research", icon: Network, label: "Research", path: "/research" },
    { id: "tech-convergence", icon: Layers, label: "Tech Convergence", path: "/tech-convergence" },
    { id: "companies", icon: Network, label: "Company Intelligence", path: "/companies" },
    { id: "trl", icon: Shield, label: "TRL Tracker", path: "/trl" },
    { id: "alerts", icon: Activity, label: "Signals & Alerts", path: "/alerts" },
    { id: "forecasting", icon: TrendingUp, label: "Tech Forecasting", path: "/tech-forecasting" },
    { id: "reports", icon: Printer, label: "Reports", path: "/reports" },
    { id: "settings", icon: Settings, label: "System Config", path: "/settings" },
  ];

  // 🧮 Decide allowed menu IDs based on department / role
  let allowedIds;

  if (role === "admin" || department === "admin") {
    // 👉 Full control for admins
    allowedIds = allMenuItems.map((m) => m.id);
  } else if (department === "strategic analysis") {
    // 👉 Strategic Analysis:
    allowedIds = [
      "dashboard",
      "patents",
      "research",
      "tech-convergence",
      "companies",
      "forecasting",
    ];
  } else if (department === "scientist") {
    // 👉 Scientist:
    allowedIds = ["dashboard", "patents", "research", "trl", "forecasting", "tech-convergence"];
  } else {
    // 👉 If profile missing / unknown dept → very limited view
    allowedIds = ["dashboard", "forecasting", "tech-convergence"];
  }

  // 🏷️ Filter & relabel
  const menuItems = allMenuItems
    .filter((item) => allowedIds.includes(item.id))
    .map((item) => {
      if (department === "strategic analysis") {
        if (item.id === "patents") {
          return { ...item, label: "Patent Intelligence" };
        }
        if (item.id === "research") {
          return { ...item, label: "Research Publications" };
        }
      }

      if (department === "scientist") {
        if (item.id === "patents") {
          return { ...item, label: "Patent Overview (summary)" };
        }
        if (item.id === "research") {
          return { ...item, label: "Research Highlights" };
        }
        if (item.id === "trl") {
          return { ...item, label: "TRL Overview" };
        }
      }

      return item;
    });

  // 👤 User display in sidebar
  const firstName = profile?.firstName || "Operative";
  const lastName = profile?.lastName || "";
  const initials = `${firstName[0] || ""}${lastName[0] || ""}`.toUpperCase();

  const roleLabel =
    role === "admin"
      ? "System Admin"
      : department === "scientist"
        ? "Scientist"
        : department === "strategic analysis"
          ? "Strategic Analyst"
          : "User";

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const SidebarContent = ({ isMobile = false }) => (
    <>
      {/* Logo Area */}
      <div className="h-20 flex items-center px-6 border-b border-white/10 relative">
        {isMobile && (
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="absolute top-6 right-4 text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        )}
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-10 h-10 min-w-[40px] bg-military-800 rounded-lg border border-neon-cyan flex items-center justify-center">
            <Shield className="w-6 h-6 text-neon-cyan" />
          </div>
          {(!isCollapsed || isMobile) && (
            <div className="flex flex-col">
              <span className="font-military font-bold text-lg tracking-widest">
                CHAKSHURA
              </span>
              <span className="text-[10px] text-gray-500 tracking-widest">
                INTEL SYSTEM
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-6 px-3">
        <div className="space-y-1">
          {menuItems.map((item) => (
            <div
              key={item.path}
              onClick={isMobile ? () => setIsMobileMenuOpen(false) : undefined}
            >
              <SidebarItem
                {...item}
                isActive={location.pathname === item.path}
                isCollapsed={!isMobile && isCollapsed}
              />
            </div>
          ))}
        </div>
      </div>

      {/* User Profile */}
      <div className="p-4 border-t border-white/10">
        <div
          className={clsx(
            "flex items-center gap-3",
            !isMobile && isCollapsed ? "justify-center" : ""
          )}
        >
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neon-cyan to-blue-600 p-[2px]">
            <div className="w-full h-full rounded-full bg-military-900 flex items-center justify-center">
              <span className="font-bold text-xs">{initials}</span>
            </div>
          </div>
          {(!isCollapsed || isMobile) && (
            <div className="flex-1 min-w-0">
              <div className="text-sm font-bold truncate">
                {firstName} {lastName}
              </div>
              <div className="text-xs text-gray-500 truncate">
                {roleLabel}
              </div>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="text-gray-400 hover:text-red-500 transition-colors"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-military-900 flex text-white overflow-hidden">
      <div className="fixed inset-0 cyber-grid opacity-10 pointer-events-none z-0" />

      {/* Desktop Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: isCollapsed ? 80 : 280 }}
        className="hidden lg:flex relative z-20 bg-military-900/95 backdrop-blur-xl border-r border-white/10 flex-col h-screen"
      >
        <SidebarContent />
      </motion.aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed left-0 top-0 h-screen w-72 z-50 bg-military-900/95 backdrop-blur-xl border-r border-white/10 flex flex-col lg:hidden"
            >
              <SidebarContent isMobile={true} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 relative z-10">
        <header className="h-16 sm:h-20 bg-military-900/80 backdrop-blur-md border-b border-white/10 flex items-center justify-between px-4 sm:px-8">
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 hover:bg-white/5 rounded-lg text-gray-400 hover:text-white transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden lg:block p-2 hover:bg-white/5 rounded-lg text-gray-400 hover:text-white transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="SEARCH INTEL..."
                className="bg-military-800/50 border border-white/10 rounded-full py-2 pl-10 pr-4 w-40 sm:w-64 text-sm focus:w-64 sm:focus:w-96 transition-all focus:border-neon-cyan focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-6">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-neon-orange/10 border border-neon-orange/30 rounded-full">
              <div className="w-2 h-2 bg-neon-orange rounded-full animate-pulse" />
              <span className="text-xs font-mono text-neon-orange">LIVE</span>
            </div>
            <button className="relative text-gray-400 hover:text-white transition-colors">
              <Bell className="w-5 h-5 sm:w-6 sm:h-6" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] flex items-center justify-center text-white">
                3
              </span>
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-8 scroll-smooth">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
