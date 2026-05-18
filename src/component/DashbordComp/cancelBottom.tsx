import { useAppDispatch } from "../../store/hooks/hook";
import { cancelRequest } from "../../store/AsyncThunks/requestsThunks";
import { useTranslation } from "react-i18next";

export const CancelButton = ({ requestId, status }: { requestId: string; status: string }) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const handleCancel = () => {
    if (window.confirm(t("dashboardPage.cancelRequestConfirm"))) {
      // cancelRequest expects an object { requestId: string }
      dispatch(cancelRequest({ requestId }));
    }
  };

  if (status === "Approved" || status === "Cancelled" || status === "Rejected") return null;

  return (
    <button
      onClick={handleCancel}
      className="
        px-3 py-1.5
        text-xs font-medium
        text-original-danger
        bg-original-danger-light
        rounded-md
        hover:bg-original-danger-light
        transition
      "
    >
      {t("dashboardPage.cancel")}
    </button>
  );
};