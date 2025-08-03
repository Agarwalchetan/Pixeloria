import React, { useState, useEffect, useCallback, useMemo } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  Code,
  Calculator,
  Beaker,
  ChevronDown,
  Sparkles,
  Zap,
  Star,
  Shield,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface NavbarProps {
  isScrolled: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ isScrolled }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showLabsDropdown, setShowLabsDropdown] = useState(false);
  const location = useLocation();

  // Memoize static data
  const labsItems = useMemo(
    () => [
      {
        name: "AI Color Generator",
        path: "/labs/color-generator",
        description: "Generate beautiful color palettes with AI",
        icon: "🎨",
        category: "AI Tools",
        featured: true,
        status: "live",
        popularity: 95,
        newFeature: false,
      },
      {
        name: "Animation Tester",
        path: "/labs/animation-tester",
        description: "Test and perfect UI animations",
        icon: "⚡",
        category: "Development",
        featured: true,
        status: "live",
        popularity: 88,
        newFeature: false,
      },
      {
        name: "Neural Network Viz",
        path: "/labs/neural-network-viz",
        description: "Visualize AI architectures",
        icon: "🧠",
        category: "AI Tools",
        featured: true,
        status: "live",
        popularity: 92,
        newFeature: true,
      },
      {
        name: "Animation Composer",
        path: "/labs/animation-composer",
        description: "Visual animation builder",
        icon: "🎭",
        category: "Development",
        featured: true,
        status: "live",
        popularity: 85,
        newFeature: false,
      },
      {
        name: "Code Playground",
        path: "/labs/code-playground",
        description: "Live code editor with AI assistance",
        icon: "💻",
        category: "Development",
        featured: false,
        status: "live",
        popularity: 78,
        newFeature: false,
      },
      {
        name: "A/B Testing Lab",
        path: "/labs/ab-testing",
        description: "Compare UI variations",
        icon: "🎯",
        category: "Analytics",
        featured: false,
        status: "live",
        popularity: 82,
        newFeature: false,
      },
      {
        name: "Component Store",
        path: "/labs/component-store",
        description: "UI component marketplace",
        icon: "📦",
        category: "Development",
        featured: false,
        status: "live",
        popularity: 75,
        newFeature: false,
      },
    ],
    []
  );

  // Memoize computed values
  const { categories, featuredItems, groupedItems, newFeatureCount } =
    useMemo(() => {
      const cats = ["AI Tools", "Development", "Analytics"];
      const featured = labsItems.filter((item) => item.featured);
      const grouped = cats.reduce((acc, category) => {
        acc[category] = labsItems.filter((item) => item.category === category);
        return acc;
      }, {} as Record<string, typeof labsItems>);
      const newCount = labsItems.filter((item) => item.newFeature).length;

      return {
        categories: cats,
        featuredItems: featured,
        groupedItems: grouped,
        newFeatureCount: newCount,
      };
    }, [labsItems]);

  // Memoize navigation items
  const navigationItems = useMemo(
    () => [
      { to: "/", label: "Home" },
      { to: "/about", label: "About" },
      { to: "/services", label: "Services" },
      { to: "/portfolio", label: "Portfolio" },
      { to: "/blog", label: "Blog" },
    ],
    []
  );

  // Optimized callbacks
  const toggleMenu = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const closeMenu = useCallback(() => {
    setIsOpen(false);
    setShowLabsDropdown(false);
  }, []);

  const handleLabsMouseEnter = useCallback(() => {
    setShowLabsDropdown(true);
  }, []);

  const handleLabsMouseLeave = useCallback(() => {
    setShowLabsDropdown(false);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    closeMenu();
  }, [location, closeMenu]);

  // Optimized animation variants
  const headerVariants = {
    initial: { y: -100 },
    animate: { y: 0 },
    transition: { duration: 0.4, ease: "easeOut" },
  };

  const mobileMenuVariants = {
    initial: { opacity: 0, height: 0 },
    animate: { opacity: 1, height: "auto" },
    exit: { opacity: 0, height: 0 },
    transition: { duration: 0.25, ease: "easeInOut" },
  };

  const dropdownVariants = {
    initial: { opacity: 0, y: 10, scale: 0.95 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: 10, scale: 0.95 },
    transition: { duration: 0.15 },
  };

  // Simplified active link component
  const ActiveLink = React.memo(
    ({
      to,
      children,
      className = "",
      onClick,
    }: {
      to: string;
      children: React.ReactNode;
      className?: string;
      onClick?: () => void;
    }) => (
      <NavLink
        to={to}
        className={({ isActive }) =>
          `relative px-4 py-2 rounded-lg font-medium transition-all duration-200 group ${
            isActive
              ? "text-blue-400 bg-blue-500/10"
              : "text-gray-300 hover:text-white hover:bg-white/5"
          } ${className}`
        }
        onClick={onClick}
      >
        {({ isActive }) => (
          <>
            {children}
            {isActive && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg border border-blue-500/30"
                initial={false}
                transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/10 group-hover:to-purple-500/10 rounded-lg transition-all duration-200" />
          </>
        )}
      </NavLink>
    )
  );

  // Simplified lab item component
  const LabItem = React.memo(
    ({
      item,
      index,
      isGrid = false,
    }: {
      item: (typeof labsItems)[0];
      index: number;
      isGrid?: boolean;
    }) => (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.03 }}
      >
        <NavLink
          to={item.path}
          className={`group flex items-center p-3 rounded-xl hover:bg-white/5 transition-all duration-200 border border-transparent hover:border-gray-700/50 relative overflow-hidden ${
            isGrid ? "min-h-[80px]" : ""
          }`}
          onClick={closeMenu}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

          <div className="flex items-center space-x-3 relative z-10 flex-1">
            <div className="text-xl flex-shrink-0">{item.icon}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <span className="font-medium text-white group-hover:text-blue-400 transition-colors text-sm">
                  {item.name}
                </span>
                {item.newFeature && (
                  <span className="text-xs bg-orange-500/20 text-orange-400 px-1.5 py-0.5 rounded-full">
                    NEW
                  </span>
                )}
                {item.featured && !isGrid && (
                  <Star size={10} className="text-yellow-400 fill-current" />
                )}
              </div>
              <p className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors truncate">
                {item.description}
              </p>

              {isGrid && (
                <div className="mt-1.5 w-full bg-gray-800 rounded-full h-1">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-purple-600 h-1 rounded-full transition-all duration-500"
                    style={{ width: `${item.popularity}%` }}
                  />
                </div>
              )}
            </div>
          </div>

          {!isGrid && (
            <div className="text-xs text-gray-500 group-hover:text-blue-400 transition-colors">
              {item.popularity}%
            </div>
          )}
        </NavLink>
      </motion.div>
    )
  );

  return (
    <motion.header
      {...headerVariants}
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-gray-900/95 backdrop-blur-sm shadow-2xl shadow-gray-900/50 border-b border-gray-800/50"
          : "bg-transparent"
      } py-4`}
    >
      <div className="w-full px-4">
        <nav className="flex items-center justify-between">
          {/* Logo */}
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <NavLink
              to="/"
              className="flex items-center space-x-3 text-2xl font-bold text-white group"
            >
              <div className="relative">
                <Code
                  size={32}
                  className="text-blue-400 group-hover:text-blue-300 transition-colors"
                />
                <div className="absolute inset-0 bg-blue-400/20 rounded-full blur-sm animate-pulse" />
              </div>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 group-hover:from-blue-300 group-hover:via-purple-300 group-hover:to-pink-300 transition-all duration-300">
                Pixeloria
              </span>
              <span className="text-xs bg-gradient-to-r from-blue-500 to-purple-500 text-white px-2 py-1 rounded-full">
                2025
              </span>
            </NavLink>
          </motion.div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-1">
            {/* Navigation Links */}
            {navigationItems.map((item) => (
              <ActiveLink key={item.to} to={item.to}>
                {item.label}
              </ActiveLink>
            ))}

            {/* Labs Dropdown */}
            <div
              className="relative"
              onMouseEnter={handleLabsMouseEnter}
              onMouseLeave={handleLabsMouseLeave}
            >
              <NavLink
                to="/labs"
                className={({ isActive }) =>
                  `relative flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-200 group ${
                    isActive
                      ? "text-blue-400 bg-blue-500/10"
                      : "text-gray-300 hover:text-white hover:bg-white/5"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Beaker size={16} className="mr-2" />
                    Labs
                    <motion.div
                      animate={{ rotate: showLabsDropdown ? 180 : 0 }}
                      transition={{ duration: 0.15 }}
                    >
                      <ChevronDown size={14} className="ml-1" />
                    </motion.div>
                    {/* Indicators */}
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    {newFeatureCount > 0 && (
                      <div className="absolute -top-2 -right-2 w-3 h-3 bg-orange-400 rounded-full flex items-center justify-center">
                        <Sparkles size={8} className="text-white" />
                      </div>
                    )}
                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg border border-blue-500/30"
                        initial={false}
                        transition={{
                          type: "spring",
                          bounce: 0.2,
                          duration: 0.4,
                        }}
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/10 group-hover:to-purple-500/10 rounded-lg transition-all duration-200" />
                  </>
                )}
              </NavLink>

              {/* Labs Dropdown Menu */}
              <AnimatePresence>
                {showLabsDropdown && (
                  <motion.div
                    {...dropdownVariants}
                    className="absolute top-full left-0 mt-2 w-[520px] bg-gray-900/98 backdrop-blur-sm border border-gray-800/50 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden z-50"
                  >
                    {/* Header */}
                    <div className="p-6 bg-gradient-to-r from-blue-600/10 to-purple-600/10 border-b border-gray-800/50">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                            <Beaker size={20} className="text-white" />
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-white">
                              Pixeloria Labs
                            </h3>
                            <p className="text-sm text-gray-400">
                              Experimental Tools & Demos
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full flex items-center">
                            <div className="w-1.5 h-1.5 bg-green-400 rounded-full mr-1.5" />
                            Live
                          </span>
                          {newFeatureCount > 0 && (
                            <span className="text-xs bg-orange-500/20 text-orange-400 px-2 py-1 rounded-full">
                              {newFeatureCount} New
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="text-xs text-gray-500">
                        Explore cutting-edge web technologies and AI-powered
                        tools
                      </div>
                    </div>

                    {/* Featured Section */}
                    <div className="p-6 border-b border-gray-800/50">
                      <div className="flex items-center space-x-2 mb-4">
                        <Star
                          size={16}
                          className="text-yellow-400 fill-current"
                        />
                        <h4 className="font-semibold text-white">
                          Featured Experiments
                        </h4>
                        <span className="text-xs text-gray-500">
                          ({featuredItems.length})
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        {featuredItems.map((item, index) => (
                          <LabItem
                            key={item.path}
                            item={item}
                            index={index}
                            isGrid
                          />
                        ))}
                      </div>
                    </div>

                    {/* Categories Section */}
                    <div className="p-6">
                      <h4 className="font-semibold text-white mb-4 flex items-center">
                        <div className="w-2 h-2 bg-blue-400 rounded-full mr-2" />
                        All Categories
                      </h4>

                      <div className="space-y-4">
                        {categories.map((category, categoryIndex) => (
                          <div key={category}>
                            <div className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
                              {category}
                            </div>
                            <div className="space-y-1">
                              {groupedItems[category].map((item, index) => (
                                <LabItem
                                  key={item.path}
                                  item={item}
                                  index={categoryIndex * 2 + index}
                                />
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="p-6 bg-gray-800/30 border-t border-gray-800/50">
                      <NavLink
                        to="/labs"
                        className="flex items-center justify-center w-full py-3 text-sm text-blue-400 hover:text-blue-300 transition-colors font-medium group"
                        onClick={closeMenu}
                      >
                        <Beaker size={16} className="mr-2" />
                        Explore All Experiments
                        <span className="ml-2 group-hover:translate-x-1 transition-transform">
                          →
                        </span>
                      </NavLink>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* CTA Buttons */}
            <div className="flex items-center space-x-3 ml-6">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <NavLink
                  to="/admin/login"
                  className="relative flex items-center px-4 py-2 rounded-xl bg-gradient-to-r from-gray-600 to-gray-700 text-white font-semibold hover:from-gray-700 hover:to-gray-800 transition-all duration-200 shadow-lg shadow-gray-500/25 hover:shadow-gray-500/40 group overflow-hidden"
                >
                  <Shield size={16} className="mr-2" />
                  Admin
                </NavLink>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <NavLink
                  to="/cost-estimator"
                  className="relative flex items-center px-4 py-2 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold hover:from-green-600 hover:to-emerald-600 transition-all duration-200 shadow-lg shadow-green-500/25 hover:shadow-green-500/40 group overflow-hidden"
                >
                  <Calculator size={16} className="mr-2" />
                  Calculator
                </NavLink>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <NavLink
                  to="/contact"
                  className="relative px-6 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40"
                >
                  Contact Us
                </NavLink>
              </motion.div>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="lg:hidden relative p-2 text-white focus:outline-none group"
            onClick={toggleMenu}
            aria-label={isOpen ? "Close Menu" : "Open Menu"}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
            <AnimatePresence mode="wait">
              {isOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <X size={24} />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <Menu size={24} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </nav>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              {...mobileMenuVariants}
              className="lg:hidden overflow-hidden"
            >
              <div className="mt-4 bg-gray-900/95 backdrop-blur-sm rounded-2xl border border-gray-800/50 shadow-2xl shadow-black/50 p-6">
                <div className="flex flex-col space-y-2">
                  {navigationItems.map((item, index) => (
                    <motion.div
                      key={item.to}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <NavLink
                        to={item.to}
                        className={({ isActive }) =>
                          `block px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                            isActive
                              ? "text-blue-400 bg-blue-500/10 border border-blue-500/30"
                              : "text-gray-300 hover:text-white hover:bg-white/5"
                          }`
                        }
                        onClick={closeMenu}
                      >
                        {item.label}
                      </NavLink>
                    </motion.div>
                  ))}

                  {/* Mobile Labs Section */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.25 }}
                    className="pt-4 border-t border-gray-800/50"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-semibold text-white flex items-center">
                        <Beaker size={18} className="mr-2 text-blue-400" />
                        Labs
                      </h3>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full">
                          Live
                        </span>
                        {newFeatureCount > 0 && (
                          <span className="text-xs bg-orange-500/20 text-orange-400 px-2 py-1 rounded-full">
                            {newFeatureCount} New
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
                        Featured
                      </div>
                      {featuredItems.slice(0, 3).map((item, index) => (
                        <motion.div
                          key={item.path}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3 + index * 0.05 }}
                        >
                          <NavLink
                            to={item.path}
                            className="flex items-center p-3 rounded-xl hover:bg-white/5 transition-all duration-200"
                            onClick={closeMenu}
                          >
                            <span className="text-lg mr-3">{item.icon}</span>
                            <div className="flex-1">
                              <div className="flex items-center space-x-2">
                                <span className="font-medium text-white text-sm">
                                  {item.name}
                                </span>
                                {item.newFeature && (
                                  <span className="text-xs bg-orange-500/20 text-orange-400 px-1.5 py-0.5 rounded-full">
                                    NEW
                                  </span>
                                )}
                                <Star
                                  size={10}
                                  className="text-yellow-400 fill-current"
                                />
                              </div>
                              <p className="text-xs text-gray-400">
                                {item.description}
                              </p>
                            </div>
                          </NavLink>
                        </motion.div>
                      ))}
                    </div>

                    <NavLink
                      to="/labs"
                      className="block text-center py-2 mt-3 text-sm text-blue-400 hover:text-blue-300 transition-colors font-medium"
                      onClick={closeMenu}
                    >
                      View All Experiments →
                    </NavLink>
                  </motion.div>

                  {/* Mobile CTA Buttons */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="pt-4 border-t border-gray-800/50 space-y-3"
                  >
                    <NavLink
                      to="/admin/login"
                      className="flex items-center justify-center py-3 px-4 rounded-xl bg-gradient-to-r from-gray-600 to-gray-700 text-white font-semibold shadow-lg"
                      onClick={closeMenu}
                    >
                      <Shield size={16} className="mr-2" />
                      Admin Portal
                    </NavLink>
                    <NavLink
                      to="/cost-estimator"
                      className="flex items-center justify-center py-3 px-4 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold shadow-lg"
                      onClick={closeMenu}
                    >
                      <Calculator size={16} className="mr-2" />
                      Cost Calculator
                    </NavLink>
                    <NavLink
                      to="/contact"
                      className="flex items-center justify-center py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold shadow-lg"
                      onClick={closeMenu}
                    >
                      Contact Us
                    </NavLink>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
};

export default Navbar;
