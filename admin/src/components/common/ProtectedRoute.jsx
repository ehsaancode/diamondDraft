import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Loader2, Gem } from 'lucide-react';

export const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background relative overflow-hidden">
        {/* Background Ornaments */}
        <div className="absolute top-[-10%] left-[-10%] w-[45%] h-[45%] rounded-full bg-primary-600/5 blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-[35%] h-[45%] rounded-full bg-accent/5 blur-[100px] pointer-events-none"></div>
        
        <div className="relative flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-primary-600 to-accent-light/20 flex items-center justify-center animate-pulse">
            <Gem size={24} className="text-white" />
          </div>
          <div className="flex items-center gap-2 text-zinc-400 text-sm font-medium">
            <Loader2 size={16} className="animate-spin text-primary-500" />
            <span>Authenticating Admin...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};
