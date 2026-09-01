import { AuthProvider, useAuth } from '@/context/AuthContext';
import Login from '@/components/Login';
import StudentHome from '@/components/StudentHome';
import TeacherDashboard from '@/components/TeacherDashboard';

function Gate() {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-slate-400">Memuat...</div>
      </div>
    );
  }
  if (!user) return <Login />;
  if (user.role === 'guru') return <TeacherDashboard />;
  return <StudentHome />;
}

export default function App() {
  return (
    <AuthProvider>
      <Gate />
    </AuthProvider>
  );
}
