import type { User } from "../../../store/slices/authSlice";

interface StudentListProps {
  students: User[];
  selectedStudentId: string | null;
  onSelectStudent: (student: User) => void;
  loading?: boolean;
}

export const StudentList = ({ students, selectedStudentId, onSelectStudent, loading }: StudentListProps) => {
  return (
    <div className="w-full bg-original-card border border-original-border rounded-xl flex flex-col overflow-hidden h-[500px]">
      <div className="p-4 border-b border-original-border bg-original-background-alt">
        <h3 className="m-0 text-lg font-bold text-original-secondary">Students</h3>
        <p className="m-0 text-xs text-original-text-muted mt-1">Select a student to view chat</p>
      </div>

      <div className="flex-1 overflow-y-auto">
        {loading && students.length === 0 ? (
          <div className="p-4 text-center text-original-text-muted text-sm">Loading students...</div>
        ) : students.length === 0 ? (
          <div className="p-4 text-center text-original-text-muted text-sm">No students found.</div>
        ) : (
          <ul className="list-none p-0 m-0">
            {students.map((student) => {
              const isSelected = selectedStudentId === student._id;
              return (
                <li key={student._id}>
                  <button
                    onClick={() => onSelectStudent(student)}
                    className={`w-full text-left p-3 border-b border-original-border-light cursor-pointer transition-colors border-l-4 ${
                      isSelected
                        ? "bg-original-background-alt text-original-primary border-l-original-primary"
                        : "bg-original-card border-l-transparent hover:bg-original-background-alt"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-original-background-alt text-original-primary flex items-center justify-center text-original-primary-active text-xs font-bold overflow-hidden shrink-0">
                        {student.avatar ? (
                          <img src={student.avatar} alt="avatar" className="w-full h-full object-cover" />
                        ) : (
                          student.name.charAt(0).toUpperCase()
                        )}
                      </div>
                      <div className="overflow-hidden">
                        <p className={`m-0 text-sm truncate ${isSelected ? "font-bold text-original-primary" : "font-medium text-original-text"}`}>
                          {student.name}
                        </p>
                        <p className="m-0 text-xs text-original-text-muted truncate">
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
