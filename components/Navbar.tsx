
import React from 'react';
import { ViewMode } from '../types';
import { Layout, Store, BarChart3, Settings, ShieldCheck, User } from 'lucide-react';

interface NavbarProps {
  currentView: ViewMode;
  onNavigate: (view: ViewMode) => void;
  isAdmin: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate, isAdmin }) => {
  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div 
              className="flex-shrink-0 flex items-center cursor-pointer" 
              onClick={() => onNavigate(ViewMode.STOREFRONT)}
            >
              <div className="h-8 w-8 bg-indigo-600 rounded-lg flex items-center justify-center mr-3">
                <Store className="text-white h-5 w-5" />
              </div>
              <span className="text-xl font-bold text-gray-900">NoonSync<span className="text-indigo-600">Pro</span></span>
            </div>
            
            <div className="hidden sm:ml-10 sm:flex sm:space-x-8">
              <button
                onClick={() => onNavigate(ViewMode.STOREFRONT)}
                className={`${currentView === ViewMode.STOREFRONT ? 'border-indigo-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors`}
              >
                Storefront
              </button>
              
              {isAdmin && (
                <>
                  <button
                    onClick={() => onNavigate(ViewMode.ADMIN_DASHBOARD)}
                    className={`${currentView === ViewMode.ADMIN_DASHBOARD ? 'border-indigo-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors`}
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={() => onNavigate(ViewMode.MARKETING)}
                    className={`${currentView === ViewMode.MARKETING ? 'border-indigo-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors`}
                  >
                    Marketing
                  </button>
                </>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center px-3 py-1 bg-gray-100 rounded-full text-xs font-medium text-gray-600">
              <ShieldCheck className="w-3 h-3 mr-1" />
              API Connected
            </div>
            <button className="p-2 text-gray-400 hover:text-gray-500">
              <User className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
