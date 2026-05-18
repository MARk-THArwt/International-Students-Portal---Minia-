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
import { useTranslation } from "react-i18next";

export const STEP_1 = () => {
  const { t } = useTranslation();
  const user = useAppSelector(selectUser);

  const STEP1_INPUTS = [
    {
      name: t("newRequest.steps.step1.fullName"),
      type: "text",
      iconStart: <User className="text-muted-foreground" />,
      iconEnd: <LockKeyholeIcon className="text-muted-foreground" />,
    },
    {
      name: t("newRequest.steps.step1.nationality"),
      type: "text",
      iconStart: <Flag />,
      iconEnd: <LockKeyholeIcon />,
    },
    {
      name: t("newRequest.steps.step1.passportNumber"),
      type: "text",
      iconStart: <FaPassport className="size-4" />,
      iconEnd: <LockKeyholeIcon />,
    },
    {
      name: t("newRequest.steps.step1.studentId"),
      type: "text",
      iconStart: <IdCardLanyardIcon />,
      iconEnd: <LockKeyholeIcon />,
    },
    {
      name: t("newRequest.steps.step1.universityEmail"),
      type: "text",
      iconStart: <Mail />,
      iconEnd: <LockKeyholeIcon />,
    },
    {
      name: t("newRequest.steps.step1.phone"),
      type: "text",
      iconStart: <Phone />,
      iconEnd: <LockKeyholeIcon />,
    },
  ];

  const getInputValue = (name: string) => {
    if (!user) return "";
    if (name === t("newRequest.steps.step1.fullName")) return user.name;
    if (name === t("newRequest.steps.step1.nationality")) return user.nationality;
    if (name === t("newRequest.steps.step1.passportNumber")) return user.passportNumber;
    if (name === t("newRequest.steps.step1.studentId")) return user.studentId;
    if (name === t("newRequest.steps.step1.universityEmail")) return user.email;
    if (name === t("newRequest.steps.step1.phone")) return user.phone;
    return "";
  };

  return (
    <div>
      <div className="mb-8">
        <h3 className="text-2xl font-bold">{t("newRequest.steps.step1.confirmIdentity")}</h3>
        <p className="text-original-text-muted">
          {t("newRequest.steps.step1.verifyPersonalInfo")}
        </p>
      </div>

      <div className="w-full max-w-5xl p-6 mx-auto border shadow-md bg-card border-original-border rounded-2xl sm:p-8">
        <div className="flex items-center gap-2 mb-6">
          <IdCardLanyardIcon className="text-original-primary-hover" />
          <p className="text-lg font-semibold">{t("newRequest.steps.step1.studentProfileData")}</p>
        </div>

        <div className="flex flex-col gap-8 lg:flex-row">
          <div className="flex justify-center lg:justify-start">
            <div className="w-32 h-32 overflow-hidden bg-original-text-dark text-white rounded-xl sm:w-40 sm:h-40">
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
