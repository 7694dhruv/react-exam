import { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, ArrowUpDown, Plus } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchStudents, setSearchQuery, setClassFilter, setSortBy, setSortOrder } from '../../store/studentsSlice';
import StudentDetails from './StudentDetails';
import Navbar from '../Navbar';

export default function StudentList() {
  const dispatch = useAppDispatch();
  const { students, loading, error, filters } = useAppSelector((state) => state.students);

  useEffect(() => {
    dispatch(fetchStudents());
  }, [dispatch]);

  const filteredAndSortedStudents = useMemo(() => {
    let filtered = [...students];

    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(
        (student) =>
          student.name.toLowerCase().includes(query) ||
          student.roll_number.toLowerCase().includes(query) ||
          student.email?.toLowerCase().includes(query)
      );
    }

    if (filters.classFilter) {
      filtered = filtered.filter((student) => student.class === filters.classFilter);
    }

    filtered.sort((a, b) => {
      const aValue = filters.sortBy === 'name' ? a.name : a.roll_number;
      const bValue = filters.sortBy === 'name' ? b.name : b.roll_number;
      const comparison = aValue.localeCompare(bValue);
      return filters.sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [students, filters]);

  const uniqueClasses = useMemo(() => {
    return Array.from(new Set(students.map((s) => s.class))).sort();
  }, [students]);

  const toggleSortOrder = () => {
    dispatch(setSortOrder(filters.sortOrder === 'asc' ? 'desc' : 'asc'));
  };

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">Error: {error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Students</h1>
              <p className="text-slate-600 mt-1">
                {filteredAndSortedStudents.length} {filteredAndSortedStudents.length === 1 ? 'student' : 'students'}
              </p>
            </div>
            <Link
              to="/students/add"
              className="inline-flex items-center justify-center space-x-2 px-6 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition shadow-sm"
            >
              <Plus className="w-5 h-5" />
              <span className="font-medium">Add Student</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative md:col-span-2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search by name, roll number, or email..."
                value={filters.searchQuery}
                onChange={(e) => dispatch(setSearchQuery(e.target.value))}
                className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition"
              />
            </div>

            <div className="flex gap-2">
              <div className="relative flex-1">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <select
                  value={filters.classFilter}
                  onChange={(e) => dispatch(setClassFilter(e.target.value))}
                  className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition appearance-none"
                >
                  <option value="">All Classes</option>
                  {uniqueClasses.map((cls) => (
                    <option key={cls} value={cls}>
                      {cls}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-2">
                <select
                  value={filters.sortBy}
                  onChange={(e) => dispatch(setSortBy(e.target.value as 'name' | 'roll_number'))}
                  className="px-4 py-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition"
                >
                  <option value="name">Name</option>
                  <option value="roll_number">Roll No.</option>
                </select>

                <button
                  onClick={toggleSortOrder}
                  className="px-4 py-3 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition"
                  title={`Sort ${filters.sortOrder === 'asc' ? 'ascending' : 'descending'}`}
                >
                  <ArrowUpDown className="w-5 h-5 text-slate-600" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {loading && students.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900"></div>
          </div>
        ) : filteredAndSortedStudents.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <p className="text-slate-600 text-lg">No students found</p>
            <p className="text-slate-500 mt-2">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedStudents.map((student) => (
              <StudentDetails key={student.id} student={student} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
