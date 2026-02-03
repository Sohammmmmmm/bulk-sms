import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { 
  LayoutDashboard, 
  BarChart3, 
  Upload, 
  CheckSquare, 
  Users, 
  FileText,
  Settings,
  HelpCircle,
  LogOut
} from 'lucide-react';

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const makerMenuItems = [
    { 
      icon: LayoutDashboard, 
      label: 'Dashboard', 
      path: '/maker',
      description: 'Overview & quick actions'
    },
    { 
      icon: Upload, 
      label: 'Upload Campaign', 
      path: '/maker/upload',
      description: 'Upload new CSV file'
    },
    { 
      icon: FileText, 
      label: 'My Campaigns', 
      path: '/maker/campaigns',
      description: 'View all campaigns'
    },
    { 
      icon: BarChart3, 
      label: 'Analytics', 
      path: '/analytics',
      description: 'Performance metrics'
    },
  ];

  const checkerMenuItems = [
    { 
      icon: LayoutDashboard, 
      label: 'Dashboard', 
      path: '/checker',
      description: 'Overview & pending items'
    },
    { 
      icon: CheckSquare, 
      label: 'Pending Reviews', 
      path: '/checker/pending',
      description: 'Items awaiting approval'
    },
    { 
      icon: FileText, 
      label: 'All Campaigns', 
      path: '/checker/campaigns',
      description: 'View all campaigns'
    },
    { 
      icon: BarChart3, 
      label: 'Analytics', 
      path: '/analytics',
      description: 'Performance metrics'
    },
  ];

  const bottomMenuItems = [
    { 
      icon: Users, 
      label: 'Contacts', 
      path: '/contacts',
      description: 'Manage contacts'
    },
    { 
      icon: Settings, 
      label: 'Settings', 
      path: '/settings',
      description: 'App preferences'
    },
    { 
      icon: HelpCircle, 
      label: 'Help & Support', 
      path: '/help',
      description: 'Get assistance'
    },
  ];

  const menuItems = user?.role === 'maker' ? makerMenuItems : checkerMenuItems;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => {
    if (path === location.pathname) return true;
    if (path !== '/maker' && path !== '/checker' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen sticky top-0">
      {/* Logo */}
      <div className="px-4 py-4 border-b border-gray-200">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <FileText className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="font-display font-semibold text-gray-900 text-sm">Nishkaiv</h2>
          </div>
        </div>
      </div>

      {/* Main Menu */}
      <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-0.5">
        <div className="space-y-0.5">
          {menuItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors duration-200 ${
                isActive(item.path)
                  ? 'bg-indigo-50 text-indigo-600'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <item.icon className={`w-4 h-4 flex-shrink-0 ${
                isActive(item.path) ? 'text-indigo-600' : 'text-gray-500'
              }`} />
              <div className="flex-1 text-left">
                <div className={`text-sm font-medium ${
                  isActive(item.path) ? 'text-indigo-600' : 'text-gray-900'
                }`}>
                  {item.label}
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Divider */}
        <div className="py-2">
          <div className="h-px bg-gray-200"></div>
        </div>

        {/* Bottom Menu */}
        <div className="space-y-0.5">
          {bottomMenuItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-colors ${
                isActive(item.path)
                  ? 'bg-gray-100 text-gray-900'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* User Profile & Logout */}
      <div className="p-4 border-t border-gray-200">
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 mb-3">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-semibold">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">
                {user?.name}
              </p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-600">Role:</span>
            <span className="font-medium text-gray-900 capitalize bg-white px-2 py-1 rounded">
              {user?.role}
            </span>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition-colors font-medium text-sm"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </aside>
  );
}