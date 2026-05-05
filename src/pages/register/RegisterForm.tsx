import React, { useState } from "react";
import { 
  User, 
  Mail, 
  Lock, 
  IdCard, 
  Globe, 
  Phone, 
  Users, 
  Briefcase, 
  Building2, 
  Camera,
  Loader2,
  AlertCircle
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../store/hooks/hook";
import { 
  registerStudent, 
  registerStaff, 
  registerAdmin,
  selectAuthLoading,
  selectAuthError 
} from "../../store/slices/authSlice";
import { useNavigate } from "react-router-dom";

type Role = "student" | "staff" | "admin";

export const RegisterForm = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isLoading = useAppSelector(selectAuthLoading());
  const error = useAppSelector(selectAuthError);

  const [role, setRole] = useState<Role>("student");
  const [formData, setFormData] = useState<Record<string, string>>({
    name: "",
    email: "",
    password: "",
    studentId: "",
    passportNumber: "",
    nationality: "",
    phone: "",
    gender: "male",
    employeeId: "",
    staffRole: "",
    department: "",
  });
  const [avatar, setAvatar] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatar(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Basic Validation
    if (!formData.name || !formData.email || !formData.password) {
      setFormError("Please fill in all basic fields.");
      return;
    }

    // Role-specific Validation
    if (role === "student") {
      if (!formData.studentId || !formData.passportNumber || !formData.nationality || !formData.phone) {
        setFormError("Please fill in all student details.");
        return;
      }
    } else if (role === "staff") {
      if (!formData.employeeId || !formData.staffRole || !formData.department) {
        setFormError("Please fill in all staff details.");
        return;
      }
    } else if (role === "admin") {
      if (!formData.employeeId) {
        setFormError("Please provide an Employee ID.");
        return;
      }
    }

    let result;

    if (role === "student") {
      result = await dispatch(registerStudent({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        studentId: formData.studentId,
        passportNumber: formData.passportNumber,
        nationality: formData.nationality,
        phone: formData.phone,
        gender: formData.gender,
        avatar: avatar || undefined
      }));
    } else if (role === "staff") {
      result = await dispatch(registerStaff({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        employeeId: formData.employeeId,
        role: formData.staffRole,
        department: formData.department,
        gender: formData.gender,
        avatar: avatar || undefined
      }));
    } else {
      result = await dispatch(registerAdmin({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        employeeId: formData.employeeId,
        role: "admin",
        gender: formData.gender,
        avatar: avatar || undefined
      }));
    }

    if (result && result.meta.requestStatus === "fulfilled") {
      navigate("/dashboard");
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      <div className="bg-blue-600 p-8 text-white text-center">
        <h2 className="text-3xl font-bold">Create Account</h2>
        <p className="text-blue-100 mt-2">Join our international academic community</p>
      </div>

      <form onSubmit={handleSubmit} className="p-8 space-y-8">
        {/* Role Selection */}
        <div className="flex flex-col space-y-2">
          <label className="text-sm font-semibold text-gray-700">I am registering as a:</label>
          <div className="grid grid-cols-3 gap-4">
            {(["student", "staff", "admin"] as Role[]).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className={`py-3 px-4 rounded-xl text-sm font-bold capitalize transition-all duration-200 border-2 ${
                  role === r
                    ? "bg-blue-50 border-blue-600 text-blue-600 shadow-sm"
                    : "bg-gray-50 border-transparent text-gray-500 hover:bg-gray-100"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Avatar Upload */}
        <div className="flex flex-col items-center space-y-4 pt-4 border-t border-gray-100">
          <div className="relative group">
            <div className="w-32 h-32 rounded-full bg-gray-100 border-4 border-white shadow-md overflow-hidden flex items-center justify-center">
              {preview ? (
                <img src={preview} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <User className="w-12 h-12 text-gray-300" />
              )}
            </div>
            <label className="absolute bottom-1 right-1 bg-blue-600 p-2 rounded-full text-white cursor-pointer hover:bg-blue-700 transition shadow-lg group-hover:scale-110">
              <Camera className="w-5 h-5" />
              <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
            </label>
          </div>
          <p className="text-xs text-gray-400">Upload profile picture (Optional)</p>
        </div>

        {/* Form Fields Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Common Fields */}
          <InputField 
            icon={<User />} label="Full Name" name="name" 
            value={formData.name} onChange={handleInputChange} required 
          />
          <InputField 
            icon={<Mail />} label="Email Address" name="email" type="email"
            value={formData.email} onChange={handleInputChange} required 
          />
          <InputField 
            icon={<Lock />} label="Password" name="password" type="password"
            value={formData.password} onChange={handleInputChange} required 
          />

          {/* Student Specific Fields */}
          {role === "student" && (
            <>
              <InputField 
                icon={<IdCard />} label="Student ID" name="studentId" 
                value={formData.studentId} onChange={handleInputChange} required 
              />
              <InputField 
                icon={<IdCard />} label="Passport Number" name="passportNumber" 
                value={formData.passportNumber} onChange={handleInputChange} required 
              />
              <InputField 
                icon={<Globe />} label="Nationality" name="nationality" 
                value={formData.nationality} onChange={handleInputChange} required 
              />
              <InputField 
                icon={<Phone />} label="Phone Number" name="phone" 
                value={formData.phone} onChange={handleInputChange} required 
              />
            </>
          )}

          {/* Common Gender Selection (Hidden from student block to be for everyone) */}
          <div className="flex flex-col space-y-1.5">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Gender</label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Users className="w-5 h-5" />
              </div>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none transition text-sm"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
          </div>

          {/* Staff & Admin Specific Fields */}
          {(role === "staff" || role === "admin") && (
            <InputField 
              icon={<IdCard />} label="Employee ID" name="employeeId" 
              value={formData.employeeId} onChange={handleInputChange} required 
            />
          )}

          {role === "staff" && (
            <>
              <InputField 
                icon={<Briefcase />} label="Staff Role" name="staffRole" 
                placeholder="e.g. Professor, Manager"
                value={formData.staffRole} onChange={handleInputChange} required 
              />
              <InputField 
                icon={<Building2 />} label="Department" name="department" 
                value={formData.department} onChange={handleInputChange} required 
              />
            </>
          )}
        </div>

        {/* Errors */}
        {(error || formError) && (
          <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm animate-shake">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p>{error || formError}</p>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-200 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-6 h-6 animate-spin" />
              Registering...
            </>
          ) : (
            "Create Account"
          )}
        </button>
      </form>
    </div>
  );
};

interface InputFieldProps {
  icon: React.ReactNode;
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
}

const InputField = ({ icon, label, name, value, onChange, type = "text", required, placeholder }: InputFieldProps) => (
  <div className="flex flex-col space-y-1.5 w-full">
    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">{label}</label>
    <div className="relative">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
        {React.cloneElement(icon as React.ReactElement<any>, { className: "w-5 h-5" })}
      </div>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none transition text-sm"
      />
    </div>
  </div>
);
