import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import MaxContainerWrapper from "@/reusable-components/max-containerWrap";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Stepper } from "./stepper";
import { STEP_1 } from "./steps/step1";
import { STEP_2 } from "./steps/step2";
import STEP_3 from "./steps/step3";
import { STEP_4 } from "./steps/step4";
import { useAppDispatch, useAppSelector } from "@/store/hooks/hook";
import { createRequest } from "@/store/AsyncThunks/requestsThunks";
import { selectServiceById } from "@/store/slices/servicesslice";
import { toast } from "sonner";

export const NewRequest = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const serviceId = searchParams.get("serviceId");
  const selectedService = useAppSelector(selectServiceById(serviceId || ""));

  const [currentStep, setCurrentStep] = useState(1);
  const [files, setFiles] = useState<File[]>([]);
  const { loading } = useAppSelector((state) => state.requests);

  const handleNext = async () => {
    if (currentStep < 4) {
      setCurrentStep((prev) => prev + 1);
    } else {
      // Final submission logic
      if (!serviceId) {
        toast.error(
          "No service selected. Please go back and select a service.",
        );
        return;
      }

      try {
        const resultAction = await dispatch(
          createRequest({ serviceId, documents: files }),
        );
        if (createRequest.fulfilled.match(resultAction)) {
          toast.success("Request submitted successfully!");
          navigate("/requests");
        } else {
          toast.error(
            (resultAction.payload as string) || "Failed to submit request",
          );
        }
      } catch {
        toast.error("An unexpected error occurred");
      }
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <STEP_1 />;
      case 2:
        return <STEP_2 />;
      case 3:
        return (
          <STEP_3
            onFilesChange={(newFiles: File[]) => setFiles(newFiles)}
            initialFiles={files}
          />
        );
      case 4:
        return (
          <STEP_4
            files={files}
            onBack={handleBack}
            onNext={handleNext}
            isSubmitting={loading.create}
            serviceName={selectedService?.name}
          />
        );
      default:
        return <STEP_1 />;
    }
  };

  return (
    <div className="min-h-screen py-10 bg-gray-300/40">
      <MaxContainerWrapper className="flex flex-col justify-center items-center gap-5">
        <Stepper activeStep={currentStep} />

        <div className="w-full">{renderStep()}</div>

        {/* Navigation Buttons - Hidden on Step 4 because Step 4 has its own buttons */}
        {currentStep < 4 && (
          <div className="flex justify-between w-full max-w-4xl mt-10 px-4">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 1}
              className="px-8 h-12 text-[16px] font-semibold"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Previous
            </Button>

            <Button
              onClick={handleNext}
              className="px-8 h-12 bg-blue-800 transition duration-300 hover:bg-blue-900 active:scale-95 text-[16px] font-semibold"
            >
              {currentStep == 3 ? (
                <>Submit Request</>
              ) : (
                <>
                  Next <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        )}
      </MaxContainerWrapper>
    </div>
  );
};
