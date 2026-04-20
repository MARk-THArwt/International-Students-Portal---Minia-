import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = [
  { id: 1, title: "Personal info", sub: "Name & nationality" },
  { id: 2, title: "Upload documents", sub: "Passport & transcript" },
  { id: 3, title: "Review", sub: "Check your details" },
  { id: 4, title: "Confirmation", sub: "Get your reference" },
];

type StepStatus = "complete" | "active" | "pending";

function StepCircle({ status, id }: { status: StepStatus; id: number }) {
  return (
    <div
      className={cn(
        "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium border shrink-0 transition-all",
        status === "complete" &&
          "bg-green-50  border-indigo-600 text-indigo-700",
        status === "active" &&
          "bg-white border-2 border-gray-500 text-gray-600",
        status === "pending" && "bg-white border-gray-200 text-gray-400",
      )}
    >
      {status === "complete" ? <Check className="w-3.5 h-3.5" /> : id}
    </div>
  );
}

function StepConnector({ complete }: { complete: boolean }) {
  return (
    <div
      className={cn(
        "flex-1 h-px mt-4 transition-colors", // ← these were missing
        complete ? "bg-indigo-500" : "bg-gray-400",
      )}
    />
  );
}

function StepItem({
  step,
  status,
}: {
  step: (typeof STEPS)[0];
  status: StepStatus;
}) {
  return (
    <div className="flex flex-col items-center gap-2">
      <StepCircle status={status} id={step.id} />
      <div className="text-center space-y-0.5">
        <p
          className={cn(
            "text-xs font-medium",
            status === "pending" ? "text-gray-400" : "text-gray-900",
          )}
        >
          {step.title}
        </p>
        <p className="text-[11px] text-gray-400">{step.sub}</p>
      </div>
    </div>
  );
}

export function Stepper({ activeStep }: { activeStep: number }) {
  return (
    <div className="w-full flex justify-center">
      <div className="flex items-start w-full translate-x-1/12">
        {" "}
        {/* ← max-w-xl keeps it from going full width */}
        {STEPS.map((step, i) => {
          const status: StepStatus =
            step.id < activeStep
              ? "complete"
              : step.id === activeStep
                ? "active"
                : "pending";

          return (
            <div key={step.id} className="flex items-start flex-1">
              <StepItem step={step} status={status} />
              {i < STEPS.length - 1 && (
                <StepConnector complete={step.id < activeStep} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
