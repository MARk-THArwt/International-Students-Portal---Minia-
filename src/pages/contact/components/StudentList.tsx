import type { User } from "../../../store/slices/authSlice";

interface StudentListProps {
  students: User[];
  selectedStudentId: string | null;
  onSelectStudent: (student: User) => void;
  loading?: boolean;
}

export const StudentList = ({ students, selectedStudentId, onSelectStudent, loading }: StudentListProps) => {
  return (
    <div className="w-full bg-white border border-gray-200 rounded-xl flex flex-col overflow-hidden h-[500px]">
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <h3 className="m-0 text-lg font-bold text-[#002147]">Students</h3>
        <p className="m-0 text-xs text-gray-500 mt-1">Select a student to view chat</p>
      </div>

      <div className="flex-1 overflow-y-auto">
        {loading && students.length === 0 ? (
          <div className="p-4 text-center text-gray-500 text-sm">Loading students...</div>
        ) : students.length === 0 ? (
          <div className="p-4 text-center text-gray-500 text-sm">No students found.</div>
        ) : (
          <ul className="list-none p-0 m-0">
            {students.map((student) => {
              const isSelected = selectedStudentId === student._id;
              return (
                <li key={student._id}>
                  <button
                    onClick={() => onSelectStudent(student)}
                    className={`w-full text-left p-3 border-b border-gray-100 cursor-pointer transition-colors border-l-4 ${
                      isSelected
                        ? "bg-blue-50 border-l-[#0F0FBD]"
                        : "bg-white border-l-transparent hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 text-xs font-bold overflow-hidden shrink-0">
                        {student.avatar ? (
                          <img src={student.avatar} alt="avatar" className="w-full h-full object-cover" />
                        ) : (
                          student.name.charAt(0).toUpperCase()
                        )}
                      </div>
                      <div className="overflow-hidden">
                        <p className={`m-0 text-sm truncate ${isSelected ? "font-bold text-[#0F0FBD]" : "font-medium text-gray-800"}`}>
                          {student.name}
                        </p>
                        <p className="m-0 text-xs text-gray-500 truncate">
                          ID: {student._id || "N/A"}
                        </p>
                      </div>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};
