import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, ArrowLeft } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { addStudent, updateStudent, fetchStudents } from '../../store/studentsSlice';
import Navbar from '../Navbar';

export default function StudentForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { students, loading } = useAppSelector((state) => state.students);
  const { user } = useAppSelector((state) => state.auth);

  const existingStudent = students.find((s) => s.id === id);
  const isEditMode = !!id && !!existingStudent;

  const [formData, setFormData] = useState({
    name: '',
    roll_number: '',
    class: '',
    email: '',
    phone: '',
    address: '',
    date_of_birth: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (students.length === 0) {
      dispatch(fetchStudents());
    }
  }, [dispatch, students.length]);

  useEffect(() => {
    if (isEditMode && existingStudent) {
      setFormData({
        name: existingStudent.name,
        roll_number: existingStudent.roll_number,
        class: existingStudent.class,
        email: existingStudent.email || '',
        phone: existingStudent.phone || '',
        address: existingStudent.address || '',
        date_of_birth: existingStudent.date_of_birth || '',
      });
    }
  }, [isEditMode, existingStudent]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.roll_number.trim()) {
      newErrors.roll_number = 'Roll number is required';
    } else {
      const duplicate = students.find(
        (s) => s.roll_number === formData.roll_number && s.id !== id
      );
      if (duplicate) {
        newErrors.roll_number = 'This roll number is already taken';
      }
    }

    if (!formData.class.trim()) {
      newErrors.class = 'Class is required';
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      if (isEditMode && existingStudent) {
        await dispatch(updateStudent({
          id: existingStudent.id,
          updates: formData,
        })).unwrap();
      } else {
        await dispatch(addStudent({
          ...formData,
          user_id: user!.id,
        })).unwrap();
      }
      navigate('/students');
    } catch (error: any) {
      setErrors({ submit: error });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate('/students')}
          className="flex items-center space-x-2 text-slate-600 hover:text-slate-900 mb-6 transition"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Students</span>
        </button>

        <div className="bg-white rounded-xl shadow-sm p-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-6">
            {isEditMode ? 'Edit Student' : 'Add New Student'}
          </h1>

          {errors.submit && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">{errors.submit}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-slate-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition ${
                    errors.name ? 'border-red-300' : 'border-slate-200'
                  }`}
                  placeholder="John Doe"
                />
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
              </div>

              <div>
                <label htmlFor="roll_number" className="block text-sm font-medium text-slate-700 mb-2">
                  Roll Number <span className="text-red-500">*</span>
                </label>
                <input
                  id="roll_number"
                  name="roll_number"
                  type="text"
                  value={formData.roll_number}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-slate-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition ${
                    errors.roll_number ? 'border-red-300' : 'border-slate-200'
                  }`}
                  placeholder="2024001"
                />
                {errors.roll_number && <p className="mt-1 text-sm text-red-600">{errors.roll_number}</p>}
              </div>

              <div>
                <label htmlFor="class" className="block text-sm font-medium text-slate-700 mb-2">
                  Class <span className="text-red-500">*</span>
                </label>
                <input
                  id="class"
                  name="class"
                  type="text"
                  value={formData.class}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-slate-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition ${
                    errors.class ? 'border-red-300' : 'border-slate-200'
                  }`}
                  placeholder="Grade 10A"
                />
                {errors.class && <p className="mt-1 text-sm text-red-600">{errors.class}</p>}
              </div>

              <div>
                <label htmlFor="date_of_birth" className="block text-sm font-medium text-slate-700 mb-2">
                  Date of Birth
                </label>
                <input
                  id="date_of_birth"
                  name="date_of_birth"
                  type="date"
                  value={formData.date_of_birth}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-slate-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition ${
                    errors.email ? 'border-red-300' : 'border-slate-200'
                  }`}
                  placeholder="student@example.com"
                />
                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-2">
                  Phone
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition"
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-medium text-slate-700 mb-2">
                Address
              </label>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition"
                placeholder="123 Main St, City, State, ZIP"
              />
            </div>

            <div className="flex items-center justify-end space-x-4 pt-4">
              <button
                type="button"
                onClick={() => navigate('/students')}
                className="px-6 py-3 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center space-x-2 px-6 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-5 h-5" />
                <span>{loading ? 'Saving...' : isEditMode ? 'Update Student' : 'Add Student'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
