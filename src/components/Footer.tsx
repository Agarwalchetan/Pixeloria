import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Code, Mail, Phone, MapPin,
  Linkedin, Twitter, Github, Facebook, Instagram, Beaker
} from 'lucide-react';
import { contactApi } from '../utils/api';

const Footer: React.FC = () => {
  const currentYear = useMemo(() => new Date().getFullYear(), []);
  const [showIcons, setShowIcons] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const timeout = setTimeout(() => setShowIcons(true), 300); // Lazy render icons
    return () => clearTimeout(timeout);
  }, []);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;

    setIsSubscribing(true);
    setSubscriptionStatus('idle');
    setErrorMessage('');

    try {
      const response = await contactApi.subscribeNewsletter(newsletterEmail);
      
      if (response.success) {
        setSubscriptionStatus('success');
        setNewsletterEmail('');
      } else {
        throw new Error(response.error || 'Subscription failed');
      }
    } catch (error) {
      setSubscriptionStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Failed to subscribe');
    } finally {
      setIsSubscribing(false);
    }
  };
  return (
    <footer className="bg-gray-900 border-t border-gray-800">
      <div className="container-custom py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <Link to="/" className="flex items-center space-x-2 text-2xl font-bold mb-4">
              <Code size={32} className="text-blue-400" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                Pixeloria
              </span>
            </Link>
            <p className="text-gray-400 mb-4">
              Crafting Digital Experiences That Grow Your Business
            </p>
            {showIcons && (
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-blue-400 transition duration-200"><Twitter size={20} /></a>
                <a href="#" className="text-gray-400 hover:text-blue-400 transition duration-200"><Facebook size={20} /></a>
                <a href="#" className="text-gray-400 hover:text-blue-400 transition duration-200"><Instagram size={20} /></a>
                <a href="#" className="text-gray-400 hover:text-blue-400 transition duration-200"><Linkedin size={20} /></a>
                <a href="#" className="text-gray-400 hover:text-blue-400 transition duration-200"><Github size={20} /></a>
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-white">Quick Links</h3>
            <ul className="space-y-2">
              {[
                { label: "Home", path: "/" },
                { label: "About Us", path: "/about" },
                { label: "Services", path: "/services" },
                { label: "Portfolio", path: "/portfolio" },
                { label: "Labs", path: "/labs", icon: Beaker },
                { label: "Blog", path: "/blog" },
                { label: "Contact", path: "/contact" },
              ].map(({ label, path, icon: Icon }, i) => (
                <li key={i}>
                  <Link to={path} className="text-gray-400 hover:text-blue-400 transition duration-200 flex items-center">
                    {Icon && <Icon size={16} className="mr-1" />}
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-white">Services</h3>
            <ul className="space-y-2">
              {[
                "Web Design", "eCommerce Development", "Web Applications",
                "CMS Integrations", "Maintenance & Support"
              ].map((service, idx) => (
                <li key={idx}>
                  <Link to="/services" className="text-gray-400 hover:text-blue-400 transition duration-200">
                    {service}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-white">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <MapPin size={20} className="text-blue-400 shrink-0 mt-1" />
                <span className="text-gray-400">
                  123 Web Dev Lane<br />
                  San Francisco, CA 94103
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone size={20} className="text-blue-400 shrink-0" />
                <a href="tel:+14155550123" className="text-gray-400 hover:text-blue-400 transition duration-200">
                  (415) 555-0123
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <Mail size={20} className="text-blue-400 shrink-0" />
                <a href="mailto:hello@pixeloria.com" className="text-gray-400 hover:text-blue-400 transition duration-200">
                  hello@pixeloria.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="md:flex md:justify-between md:items-center">
            <div className="mb-6 md:mb-0">
              <h3 className="text-xl font-bold mb-2 text-white">Subscribe to our newsletter</h3>
              <p className="text-gray-400">Stay updated with our latest news and insights</p>
            </div>
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row">
              <input
                type="email"
                placeholder="Your email address"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                className="px-4 py-3 mb-2 sm:mb-0 sm:mr-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400"
                required
                disabled={isSubscribing}
              />
              <button 
                type="submit"
                disabled={isSubscribing || !newsletterEmail.trim()}
                className={`btn-primary ${isSubscribing ? 'opacity-75 cursor-not-allowed' : ''}`}
              >
                {isSubscribing ? 'Subscribing...' : 'Subscribe'}
              </button>
            </form>
          </div>
          
          {/* Subscription Status Messages */}
          {subscriptionStatus === 'success' && (
            <div className="mt-4 p-3 bg-green-600/20 border border-green-500/30 rounded-lg">
              <p className="text-green-400 text-sm">
                ✅ Successfully subscribed! Thank you for joining our newsletter.
              </p>
            </div>
          )}
          
          {subscriptionStatus === 'error' && (
            <div className="mt-4 p-3 bg-red-600/20 border border-red-500/30 rounded-lg">
              <p className="text-red-400 text-sm">
                ❌ {errorMessage || 'Subscription failed. Please try again.'}
              </p>
            </div>
          )}
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>© {currentYear} Pixeloria. All rights reserved.</p>
          <p className="mt-2 space-x-4">
            <Link to="/privacy-policy" className="hover:text-blue-400 transition duration-200">
              Privacy Policy
            </Link>
            |
            <Link to="/terms" className="hover:text-blue-400 transition duration-200">
              Terms of Service
            </Link>
          </p>
        </div>
    </footer>
  );
};

export default React.memo(Footer);
