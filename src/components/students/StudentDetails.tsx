import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Phone, MapPin, Calendar, GraduationCap, Edit2, Trash2 } from 'lucide-react';
import { useAppDispatch } from '../../store/hooks';
import { deleteStudent } from '../../store/studentsSlice';
import type { Student } from '../../lib/supabase';

interface StudentDetailsProps {
  student: Student;
}

export default function StudentDetails({ student }: StudentDetailsProps) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleEdit = () => {
    navigate(`/students/edit/${student.id}`);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await dispatch(deleteStudent(student.id)).unwrap();
    } catch (error) {
      console.error('Failed to delete student:', error);
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not provided';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-slate-200">
        <div className="bg-gradient-to-br from-slate-900 to-slate-700 h-24"></div>

        <div className="px-6 pb-6">
          <div className="flex items-start justify-between -mt-8 mb-4">
            <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center shadow-md border-4 border-white">
              <GraduationCap className="w-8 h-8 text-slate-900" />
            </div>

            <div className="flex items-center space-x-2 mt-10">
              <button
                onClick={handleEdit}
                className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition"
                title="Edit student"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                title="Delete student"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <h3 className="text-xl font-bold text-slate-900">{student.name}</h3>
              <p className="text-sm text-slate-500">Roll No: {student.roll_number}</p>
            </div>

            <div className="flex items-center space-x-2 text-slate-600">
              <GraduationCap className="w-4 h-4" />
              <span className="text-sm">{student.class}</span>
            </div>

            {student.email && (
              <div className="flex items-center space-x-2 text-slate-600">
                <Mail className="w-4 h-4" />
                <span className="text-sm truncate">{student.email}</span>
              </div>
            )}

            {student.phone && (
              <div className="flex items-center space-x-2 text-slate-600">
                <Phone className="w-4 h-4" />
                <span className="text-sm">{student.phone}</span>
              </div>
            )}

            {student.address && (
              <div className="flex items-start space-x-2 text-slate-600">
                <MapPin className="w-4 h-4 mt-0.5" />
                <span className="text-sm">{student.address}</span>
              </div>
            )}

            {student.date_of_birth && (
              <div className="flex items-center space-x-2 text-slate-600">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">{formatDate(student.date_of_birth)}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-slate-900 mb-2">Delete Student</h3>
            <p className="text-slate-600 mb-6">
              Are you sure you want to delete <span className="font-semibold">{student.name}</span>? This action cannot be undone.
            </p>

            <div className="flex items-center justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isDeleting}
                className="px-4 py-2 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
