
import React from 'react';
import { Heart, Github, Twitter, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Footer = () => {
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 mt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">ITEMKU</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
              The best platform to buy digital game items with guaranteed security and affordable prices.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <button 
                  onClick={() => handleNavigation('/')} 
                  className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-purple-400 transition-colors text-left"
                >
                  Home
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNavigation('/profile')} 
                  className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-purple-400 transition-colors text-left"
                >
                  Profile
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNavigation('/settings')} 
                  className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-purple-400 transition-colors text-left"
                >
                  Settings
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNavigation('/purchase-history')} 
                  className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-purple-400 transition-colors text-left"
                >
                  Purchase History
                </button>
              </li>
            </ul>
          </div>

          {/* Contact & Social */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Connect</h3>
            <div className="flex space-x-3 mb-4">
              <a 
                href="https://github.com/itemku" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-purple-400 transition-colors"
              >
                <Github size={20} />
              </a>
              <a 
                href="https://twitter.com/itemku" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-purple-400 transition-colors"
              >
                <Twitter size={20} />
              </a>
              <a 
                href="mailto:irzalraisyaramadhan@gmail.com" 
                className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-purple-400 transition-colors"
              >
                <Mail size={20} />
              </a>
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-sm break-all">
              irzalraisyaramadhan@gmail.com
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 dark:border-gray-700 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            © 2024 ITEMKU. All rights reserved.
          </p>
          <div className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-300 mt-2 md:mt-0">
            <span>Made with</span>
            <Heart size={14} className="text-red-500 fill-current" />
            <span>by ITEMKU Team</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
