import { useAuth } from '../context/AuthContext';
import AdminDashboard from '../components/dashboard/AdminDashboard';
import OfficerDashboard from '../components/dashboard/OfficerDashboard';
import PublicDashboard from '../components/dashboard/PublicDashboard';

export default function Dashboard() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center" style={{ background: '#1A1208' }}>
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  // Route based on role
  if (user?.role === 'public') {
    return <PublicDashboard />;
  }

  if (user?.role === 'department') {
    return <OfficerDashboard />;
  }

  // Default: admin gets full admin dashboard with governance
  return <AdminDashboard />;
}
