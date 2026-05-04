import { InputWithIcons } from "@/components/Input-with-icons";
import {
  Flag,
  IdCardLanyardIcon,
  LockKeyholeIcon,
  Mail,
  Phone,
  User,
} from "lucide-react";
import { FaPassport } from "react-icons/fa";
import { useAppSelector } from "@/store/hooks/hook";
import { selectUser } from "@/store/slices/authSlice";

const STEP1_INPUTS = [
  {
    name: "Full Name (English)",
    type: "text",
    iconStart: <User className="text-muted-foreground" />,
    iconEnd: <LockKeyholeIcon className="text-muted-foreground" />,
  },
  {
    name: "Nationality",
    type: "text",
    iconStart: <Flag />,
    iconEnd: <LockKeyholeIcon />,
  },
  {
    name: "Passport Number",
    type: "text",
    iconStart: <FaPassport className="size-4" />,
    iconEnd: <LockKeyholeIcon />,
  },
  {
    name: "Student ID",
    type: "text",
    iconStart: <IdCardLanyardIcon />,
    iconEnd: <LockKeyholeIcon />,
  },
  {
    name: "University Email",
    type: "text",
    iconStart: <Mail />,
    iconEnd: <LockKeyholeIcon />,
  },
  {
    name: "Phone Number",
    type: "text",
    iconStart: <Phone />,
    iconEnd: <LockKeyholeIcon />,
  },
];

export const STEP_1 = () => {
  const user = useAppSelector(selectUser);

  const getInputValue = (name: string) => {
    if (!user) return "";
    switch (name) {
      case "Full Name (English)":
        return user.name;
      case "Nationality":
        return user.nationality;
      case "Passport Number":
        return user.passportNumber;
      case "Student ID":
        return user.studentId;
      case "University Email":
        return user.email;
      case "Phone Number":
        return user.phone;
      default:
        return "";
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h3 className="text-2xl font-bold">Confirm your Identity</h3>
        <p className="text-zinc-600">
          Please verify your personal information before proceeding.
        </p>
      </div>

      <div className="w-full max-w-5xl p-6 mx-auto border shadow-md bg-card border-zinc-300 rounded-2xl sm:p-8">
        <div className="flex items-center gap-2 mb-6">
          <IdCardLanyardIcon className="text-blue-700" />
          <p className="text-lg font-semibold">Student Profile Data</p>
        </div>

        <div className="flex flex-col gap-8 lg:flex-row">
          <div className="flex justify-center lg:justify-start">
            <div className="w-32 h-32 overflow-hidden bg-gray-800 rounded-xl sm:w-40 sm:h-40">
              <img
                alt="profile"
                src={user?.avatar || "/src/assets/Image+Border+Shadow.jpg"}
                className="object-cover w-full h-full"
              />
            </div>
          </div>

          <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2">
            {STEP1_INPUTS.map((input, index) => (
              <InputWithIcons
                key={index}
                data={input}
                value={getInputValue(input.name)}
                readOnly
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
