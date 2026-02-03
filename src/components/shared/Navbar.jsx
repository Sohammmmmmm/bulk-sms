import { useAuth } from '../../hooks/useAuth';
import { useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { Send, LogOut, BarChart3, User } from 'lucide-react';
import Profile from './Profile';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showProfile, setShowProfile] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-indigo-600 rounded-lg flex items-center justify-center shadow-none">
              <Send className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-display font-semibold text-gray-900">
                Nishkaiv SMS
              </h1>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => navigate(user?.role === 'maker' ? '/maker' : '/checker')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                location.pathname.includes(user?.role)
                  ? 'text-indigo-600 bg-indigo-50'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => navigate('/analytics')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-1.5 ${
                location.pathname === '/analytics'
                  ? 'text-indigo-600 bg-indigo-50'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              Analytics
            </button>
          </div>

          {/* User Menu */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowProfile(true)}
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <div className="w-7 h-7 bg-indigo-600 rounded-full flex items-center justify-center">
                <User className="w-3.5 h-3.5 text-white" />
              </div>
              <div className="text-sm hidden sm:block">
                <p className="font-medium text-gray-900">{user?.name}</p>
              </div>
            </button>
            <button
              onClick={handleLogout}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          {/* Profile Modal */}
          <Profile isOpen={showProfile} onClose={() => setShowProfile(false)} />
        </div>
      </div>
    </nav>
  );
}