import { useAuth } from '../context/AuthContext';
import AdminDashboard from '../components/dashboard/AdminDashboard';
import CitizenDashboard from '../components/dashboard/CitizenDashboard';

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

  // Render the appropriate dashboard based on user role
  if (user?.role === 'public') {
    return <CitizenDashboard />;
  }

  // Default to Admin Dashboard for admins and departments
  return <AdminDashboard />;
}
