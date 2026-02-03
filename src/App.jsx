import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './hooks/useAuth';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import MakerDashboard from './pages/MakerDashboard';
import CheckerDashboard from './pages/CheckerDashboard';
import Analytics from './pages/Analytics';
import Navbar from './components/shared/Navbar';

function ProtectedRoute({ children, allowedRole }) {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  if (allowedRole && user.role !== allowedRole) {
    return <Navigate to={user.role === 'maker' ? '/maker' : '/checker'} />;
  }
  
  return children;
}

function AppRoutes() {
  const { user } = useAuth();
  
  return (
    <div className="min-h-screen bg-gray-50">
      {user && <Navbar />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/maker"
          element={
            <ProtectedRoute allowedRole="maker">
              <MakerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/checker"
          element={
            <ProtectedRoute allowedRole="checker">
              <CheckerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/analytics"
          element={
            <ProtectedRoute>
              <Analytics />
            </ProtectedRoute>
          }
        />
        <Route
          path="/"
          element={
            user ? (
              <Navigate to={user.role === 'maker' ? '/maker' : '/checker'} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;