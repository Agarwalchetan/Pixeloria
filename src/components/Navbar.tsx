import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, X, Code, Calculator, Beaker } from 'lucide-react';

interface NavbarProps {
  isScrolled: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ isScrolled }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <header
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-gray-900/95 backdrop-blur-md shadow-lg shadow-gray-900/50'
          : 'bg-transparent'
      } py-4`}
    >
      <div className="container-custom">
        <nav className="flex items-center justify-between">
          <NavLink 
            to="/" 
            className="flex items-center space-x-2 text-2xl font-bold text-white"
          >
            <Code size={32} className="text-blue-400" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
              Pixeloria
            </span>
          </NavLink>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <NavLink 
              to="/" 
              className={({ isActive }) => 
                `font-medium transition-colors ${
                  isActive ? 'text-blue-400' : 'text-gray-300 hover:text-white'
                }`
              }
            >
              Home
            </NavLink>
            <NavLink 
              to="/about" 
              className={({ isActive }) => 
                `font-medium transition-colors ${
                  isActive ? 'text-blue-400' : 'text-gray-300 hover:text-white'
                }`
              }
            >
              About
            </NavLink>
            <NavLink 
              to="/services" 
              className={({ isActive }) => 
                `font-medium transition-colors ${
                  isActive ? 'text-blue-400' : 'text-gray-300 hover:text-white'
                }`
              }
            >
              Services
            </NavLink>
            <NavLink 
              to="/portfolio" 
              className={({ isActive }) => 
                `font-medium transition-colors ${
                  isActive ? 'text-blue-400' : 'text-gray-300 hover:text-white'
                }`
              }
            >
              Portfolio
            </NavLink>
            <NavLink 
              to="/labs" 
              className={({ isActive }) => 
                `flex items-center font-medium transition-colors ${
                  isActive ? 'text-blue-400' : 'text-gray-300 hover:text-white'
                }`
              }
            >
              <Beaker size={16} className="mr-1" />
              Labs
            </NavLink>
            <NavLink 
              to="/blog" 
              className={({ isActive }) => 
                `font-medium transition-colors ${
                  isActive ? 'text-blue-400' : 'text-gray-300 hover:text-white'
                }`
              }
            >
              Blog
            </NavLink>
            <NavLink 
              to="/cost-estimator" 
              className="flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-green-500 to-blue-500 text-white font-medium hover:from-green-600 hover:to-blue-600 transition-all duration-300"
            >
              <Calculator size={16} className="mr-2" />
              Calculator
            </NavLink>
            <NavLink 
              to="/contact" 
              className="btn-primary"
            >
              Contact Us
            </NavLink>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white focus:outline-none"
            onClick={toggleMenu}
            aria-label={isOpen ? 'Close Menu' : 'Open Menu'}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-gray-900/95 backdrop-blur-md shadow-lg py-4 px-4 border-t border-gray-800">
            <div className="flex flex-col space-y-4">
              <NavLink 
                to="/" 
                className={({ isActive }) => 
                  `font-medium py-2 ${isActive ? 'text-blue-400' : 'text-gray-300 hover:text-white'}`
                }
                onClick={closeMenu}
              >
                Home
              </NavLink>
              <NavLink 
                to="/about" 
                className={({ isActive }) => 
                  `font-medium py-2 ${isActive ? 'text-blue-400' : 'text-gray-300 hover:text-white'}`
                }
                onClick={closeMenu}
              >
                About
              </NavLink>
              <NavLink 
                to="/services" 
                className={({ isActive }) => 
                  `font-medium py-2 ${isActive ? 'text-blue-400' : 'text-gray-300 hover:text-white'}`
                }
                onClick={closeMenu}
              >
                Services
              </NavLink>
              <NavLink 
                to="/portfolio" 
                className={({ isActive }) => 
                  `font-medium py-2 ${isActive ? 'text-blue-400' : 'text-gray-300 hover:text-white'}`
                }
                onClick={closeMenu}
              >
                Portfolio
              </NavLink>
              <NavLink 
                to="/labs" 
                className={({ isActive }) => 
                  `flex items-center font-medium py-2 ${isActive ? 'text-blue-400' : 'text-gray-300 hover:text-white'}`
                }
                onClick={closeMenu}
              >
                <Beaker size={16} className="mr-2" />
                Labs
              </NavLink>
              <NavLink 
                to="/blog" 
                className={({ isActive }) => 
                  `font-medium py-2 ${isActive ? 'text-blue-400' : 'text-gray-300 hover:text-white'}`
                }
                onClick={closeMenu}
              >
                Blog
              </NavLink>
              <NavLink 
                to="/cost-estimator" 
                className="flex items-center py-2 px-4 rounded-lg bg-gradient-to-r from-green-500 to-blue-500 text-white font-medium"
                onClick={closeMenu}
              >
                <Calculator size={16} className="mr-2" />
                Cost Calculator
              </NavLink>
              <NavLink 
                to="/contact" 
                className="btn-primary w-full flex justify-center"
                onClick={closeMenu}
              >
                Contact Us
              </NavLink>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;