import React from "react";
import { useAppSelector } from "../../store/hooks/hook";
import { selectUser } from "../../store/slices/authSlice";
import { 
  User, 
  Mail, 
  Hash, 
  Book, 
  Globe, 
  Phone, 
  Users, 
  ShieldAlert
} from "lucide-react";

export default function StudentProfile() {
  const user = useAppSelector(selectUser);

  // If no user is logged in
  if (!user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center max-w-sm w-full text-center">
          <User className="w-16 h-16 text-gray-300 mb-4" />
          <h2 className="text-xl font-bold text-gray-800">No user data available</h2>
          <p className="text-gray-500 mt-2">Please log in to view your profile.</p>
        </div>
      </div>
    );
  }

  // If user is not a student
  if (user.role !== "student") {
    return (
      <div className="flex min-h-[60vh] items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-red-100 flex flex-col items-center max-w-sm w-full text-center">
          <ShieldAlert className="w-16 h-16 text-red-500 mb-4" />
          <h2 className="text-xl font-bold text-gray-800">Access denied</h2>
          <p className="text-gray-500 mt-2">You do not have permission to view this page. Only students can access this profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] w-full flex items-start justify-center p-4 md:p-8">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden">
        
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-12 relative flex flex-col items-center justify-center text-center">
          {/* Avatar */}
          <div className="w-28 h-28 rounded-full border-4 border-white overflow-hidden bg-white flex items-center justify-center mb-4 shadow-lg">
            {user.avatar ? (
              <img 
                src={user.avatar} 
                alt={user.name} 
                className="w-full h-full object-cover" 
              />
            ) : (
              <User className="w-12 h-12 text-gray-400" />
            )}
          </div>
          
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">
            {user.name}
          </h1>
          <p className="text-blue-100 font-medium text-sm md:text-base bg-white/20 px-4 py-1 rounded-full inline-block backdrop-blur-sm">
            Student Profile
          </p>
        </div>

        {/* Content Section */}
        <div className="p-6 md:p-10">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              Personal Information
            </h2>
          </div>
          
          {/* Grid Layout: 1 column on small screens, 2 columns on medium+ screens */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <InfoItem 
              icon={<User className="w-5 h-5" />} 
              label="Full Name" 
              value={user.name} 
            />
            <InfoItem 
              icon={<Mail className="w-5 h-5" />} 
              label="Email Address" 
              value={user.email} 
            />
            <InfoItem 
              icon={<Hash className="w-5 h-5" />} 
              label="Student ID" 
              value={user.studentId} 
            />
            <InfoItem 
              icon={<Book className="w-5 h-5" />} 
              label="Passport Number" 
              value={user.passportNumber} 
            />
            <InfoItem 
              icon={<Globe className="w-5 h-5" />} 
              label="Nationality" 
              value={user.nationality} 
            />
            <InfoItem 
              icon={<Phone className="w-5 h-5" />} 
              label="Phone Number" 
              value={user.phone} 
            />
            <InfoItem 
              icon={<Users className="w-5 h-5" />} 
              label="Gender" 
              value={user.gender} 
            />
          </div>
        </div>
        
      </div>
    </div>
  );
}

// Reusable component for displaying individual info items
function InfoItem({ 
  icon, 
  label, 
  value 
}: { 
  icon: React.ReactNode; 
  label: string; 
  value?: string | null;
}) {
  return (
    <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-50/50 border border-gray-100 hover:bg-gray-50 transition-colors group">
      <div className="p-3 bg-white rounded-lg text-blue-600 shadow-sm border border-gray-100 shrink-0 group-hover:scale-105 transition-transform">
        {icon}
      </div>
      <div className="flex flex-col overflow-hidden">
        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">
          {label}
        </span>
        <span className="text-sm font-semibold text-gray-800 truncate">
          {value || <span className="text-gray-400 italic font-normal">Not provided</span>}
        </span>
      </div>
    </div>
  );
}
