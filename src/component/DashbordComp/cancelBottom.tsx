import { useAppDispatch } from "../../store/hooks/hook";
import { cancelRequest } from "../../store/AsyncThunks/requestsThunks";

export const CancelButton = ({ requestId, status }: { requestId: string; status: string }) => {
  const dispatch = useAppDispatch();

  const handleCancel = () => {
    if (window.confirm("Are you sure you want to cancel this request?")) {
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
        text-red-600
        bg-red-50
        rounded-md
        hover:bg-red-100
        transition
      "
    >
      Cancel
    </button>
  );
};