import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { useAppDispatch } from './store/hooks';
import { checkAuth, setUser } from './store/authSlice';
import { supabase } from './lib/supabase';
import PrivateRoute from './components/PrivateRoute';
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import StudentList from './components/students/StudentList';
import StudentForm from './components/students/StudentForm';

function AuthProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(checkAuth());

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      (() => {
        dispatch(setUser(session?.user ?? null));
      })();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [dispatch]);

  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route
        path="/students"
        element={
          <PrivateRoute>
            <StudentList />
          </PrivateRoute>
        }
      />
      <Route
        path="/students/add"
        element={
          <PrivateRoute>
            <StudentForm />
          </PrivateRoute>
        }
      />
      <Route
        path="/students/edit/:id"
        element={
          <PrivateRoute>
            <StudentForm />
          </PrivateRoute>
        }
      />
      <Route path="/" element={<Navigate to="/students" replace />} />
      <Route path="*" element={<Navigate to="/students" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
