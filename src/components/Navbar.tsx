import { Link, useNavigate, useLocation } from 'react-router-dom';
import { GraduationCap, LogOut, UserCircle, Plus, List } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { signOut } from '../store/authSlice';

export default function Navbar() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAppSelector((state) => state.auth);

  const handleSignOut = async () => {
    await dispatch(signOut());
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link to="/students" className="flex items-center space-x-2 group">
              <div className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center group-hover:scale-105 transition">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-900">Student Manager</span>
            </Link>

            <div className="hidden md:flex items-center space-x-1">
              <Link
                to="/students"
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition ${
                  isActive('/students')
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <List className="w-4 h-4" />
                <span className="font-medium">Students</span>
              </Link>

              <Link
                to="/students/add"
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition ${
                  isActive('/students/add')
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Plus className="w-4 h-4" />
                <span className="font-medium">Add Student</span>
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-2 text-slate-600">
              <UserCircle className="w-5 h-5" />
              <span className="text-sm font-medium">{user?.email}</span>
            </div>

            <button
              onClick={handleSignOut}
              className="flex items-center space-x-2 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition"
            >
              <LogOut className="w-4 h-4" />
              <span className="font-medium">Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
