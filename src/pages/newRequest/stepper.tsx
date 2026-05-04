import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = [
  { id: 1, title: "Personal info", sub: "Verify your data" },
  { id: 2, title: "Service details", sub: "Review service info" },
  { id: 3, title: "Upload & Submit", sub: "Attach documents" },
  { id: 4, title: "Confirmation", sub: "Request reference" },
];

type StepStatus = "complete" | "active" | "pending";

function StepCircle({ status, id }: { status: StepStatus; id: number }) {
  return (
    <div
      className={cn(
        "w-11 h-11 rounded-full flex items-center justify-center text-lg font-semibold border-2 shrink-0 transition-all duration-300 z-10",
        status === "complete" && "bg-green-50 border-green-600 text-green-700",
        status === "active" &&
          "bg-white border-indigo-600 text-indigo-600 ring-4 ring-indigo-100 scale-110",
        status === "pending" && "bg-white border-gray-200 text-gray-400",
      )}
    >
      {status === "complete" ? <Check className="w-5 h-5" /> : id}
    </div>
  );
}

function StepConnector({ complete }: { complete: boolean }) {
  return (
    <div
      className={cn(
        "h-0.5 transition-colors z-0 absolute top-[22px]",
        complete ? "bg-indigo-600" : "bg-gray-200",
      )}
      style={{ left: "calc(50% + 22px)", right: "-50%" }}
    />
  );
}

function StepItem({
  step,
  status,
  showConnector,
}: {
  step: (typeof STEPS)[0];
  status: StepStatus;
  showConnector: boolean;
}) {
  return (
    <div className="flex flex-col items-center flex-1 min-w-0 px-2 relative">
      <StepCircle status={status} id={step.id} />

      {showConnector && <StepConnector complete={status === "complete"} />}

      <div className="text-center mt-6 space-y-1 w-full max-w-[160px]">
        <p
          className={cn(
            "text-sm font-medium leading-tight",
            status === "pending" ? "text-gray-400" : "text-gray-900",
          )}
        >
          {step.title}
        </p>
        <p className="text-xs text-gray-500 leading-tight">{step.sub}</p>
      </div>
    </div>
  );
}

export function Stepper({ activeStep }: { activeStep: number }) {
  const total = STEPS.length;

  // Desktop: show all steps
  const allSteps = STEPS;

  // Mobile: show previous + current + next (centered)
  const prev = activeStep > 1 ? STEPS[activeStep - 2] : null;
  const current = STEPS[activeStep - 1];
  const next = activeStep < total ? STEPS[activeStep] : null;
  const mobileSteps = [prev, current, next].filter(
    Boolean,
  ) as (typeof STEPS)[0][];

  return (
    <div className="w-full py-10">
      <div className="max-w-5xl mx-auto px-6">
        {/* Desktop version - All steps visible */}
        <div className="hidden lg:flex items-start justify-between gap-6 relative">
          {allSteps.map((step, index) => {
            const status: StepStatus =
              step.id < activeStep
                ? "complete"
                : step.id === activeStep
                  ? "active"
                  : "pending";

            const isLast = index === allSteps.length - 1;

            return (
              <StepItem
                key={step.id}
                step={step}
                status={status}
                showConnector={!isLast}
              />
            );
          })}
        </div>

        {/* Mobile version - Max 3 steps with current centered */}
        <div className="lg:hidden flex items-start justify-center gap-8 relative">
          {mobileSteps.map((step, index) => {
            const status: StepStatus =
              step.id < activeStep
                ? "complete"
                : step.id === activeStep
                  ? "active"
                  : "pending";

            const isLastVisible = index === mobileSteps.length - 1;

            return (
              <StepItem
                key={step.id}
                step={step}
                status={status}
                showConnector={!isLastVisible}
              />
            );
          })}
        </div>
      </div>

      {/* Step counter */}
      <div className="text-center mt-12 text-sm text-gray-500">
        Step <span className="font-semibold text-indigo-700">{activeStep}</span>{" "}
        of {total}
      </div>
    </div>
  );
}
