import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { getServiceById } from "@/store/AsyncThunks/servicesThunks";
import { useAppDispatch, useAppSelector } from "@/store/hooks/hook";
import { selectServiceById } from "@/store/slices/servicesslice";
import {
  IconAlertTriangle,
  IconCircleCheck,
  IconFileDescription,
  IconFileText,
  IconFlame,
  IconSend,
  IconTag,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

type UrgencyLevel = "Normal" | "Urgent" | "Critical";

const ReadOnlyField = ({
  label,
  value,
  icon: Icon,
  required,
}: {
  label: string;
  value: string;
  icon?: React.ElementType;
  required?: boolean;
}) => {
  return (
    <div className="space-y-1.5">
      <Label className="text-[11px] font-bold tracking-widest uppercase text-muted-foreground/70">
        {label}
        {required && <span className="ms-1 text-original-danger normal-case">*</span>}
      </Label>
      <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl border border-dashed border-original-border bg-original-background-alt/60">
        {Icon && <Icon size={14} className="text-original-text-muted shrink-0" />}
        <span className="text-sm font-medium text-original-text truncate">
          {value || "—"}
        </span>
      </div>
    </div>
  );
};

const SectionHeader = ({ step, title }: { step: string; title: string }) => {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className="flex items-center justify-center w-5 h-5 rounded-full bg-primary/90 text-primary-foreground text-[10px] font-bold shrink-0">
        {step}
      </div>
      <h2 className="text-[11px] font-bold tracking-[0.18em] uppercase text-muted-foreground/80">
        {title}
      </h2>
      <div className="flex-1 h-px bg-border/60" />
    </div>
  );
};

export const STEP_2 = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const dispatch = useAppDispatch();
  const serviceId = searchParams.get("serviceId");
  const selectedService = useAppSelector(selectServiceById(serviceId || ""));

  const URGENCY_CONFIG = {
    Normal: {
      icon: IconCircleCheck,
      color: "text-original-success",
      bg: "bg-original-success-light",
      border: "border-original-success",
      dot: "bg-original-success text-white",
      label: t("newRequest.steps.step2.urgency.NormalDesc"),
    },
    Urgent: {
      icon: IconFlame,
      color: "text-original-warning",
      bg: "bg-original-warning-light",
      border: "border-original-warning",
      dot: "bg-original-warning text-white",
      label: t("newRequest.steps.step2.urgency.UrgentDesc"),
    },
    Critical: {
      icon: IconAlertTriangle,
      color: "text-original-danger",
      bg: "bg-original-danger-light",
      border: "border-original-danger",
      dot: "bg-original-danger text-white",
      label: t("newRequest.steps.step2.urgency.CriticalDesc"),
    },
  } as const;

  useEffect(() => {
    if (serviceId && !selectedService) {
      dispatch(getServiceById(serviceId));
    }
  }, [serviceId, selectedService, dispatch]);

  const [urgency, setUrgency] = useState<UrgencyLevel>("Normal");
  const [subject, setSubject] = useState("");
  const [serviceType, setServiceType] = useState("");
  const [deliveryPreference] = useState(t("newRequest.steps.step2.digitalCopy"));

  useEffect(() => {
    if (selectedService) {
      setServiceType(selectedService.category || "");
      setSubject(selectedService.name || "");

      // Map priority to urgency
      if (selectedService.priority === "low") setUrgency("Normal");
      else if (selectedService.priority === "medium") setUrgency("Urgent");
      else if (selectedService.priority === "high") setUrgency("Critical");
    }
  }, [selectedService]);

  const activeConfig = URGENCY_CONFIG[urgency];
  const ActiveIcon = activeConfig.icon;

  return (
    <div className="max-w-3xl mx-auto">
      {/* Page Header */}
      <div className="mb-7">
        <h1 className="text-2xl font-bold tracking-tight">{t("newRequest.steps.step2.header")}</h1>
        <p className="mt-1.5 text-sm text-muted-foreground max-w-md">
          {t("newRequest.steps.step2.headerDesc")}
        </p>
      </div>

      <div className="space-y-5">
        {/* Section 1 — Request Information */}
        <div className="p-6 border rounded-2xl bg-card shadow-sm">
          <SectionHeader step="1" title={t("newRequest.steps.step2.requestInfo")} />

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <ReadOnlyField
              label={t("newRequest.steps.step2.serviceCategory")}
              value={serviceType}
              icon={IconTag}
              required
            />
            <ReadOnlyField
              label={t("newRequest.steps.step2.deliveryPreference")}
              value={deliveryPreference}
              icon={IconSend}
            />
          </div>

          {/* Urgency — read-only display */}
          <div className="mt-4 space-y-2">
            <Label className="text-[11px] font-bold tracking-widest uppercase text-muted-foreground/70">
              {t("newRequest.steps.step2.urgencyLevel")} <span className="text-original-danger normal-case">*</span>
            </Label>
            <div className="grid grid-cols-3 gap-2.5">
              {(Object.keys(URGENCY_CONFIG) as UrgencyLevel[]).map((level) => {
                const cfg = URGENCY_CONFIG[level];
                const LevelIcon = cfg.icon;
                const isActive = urgency === level;

                return (
                  <div
                    key={level}
                    className={cn(
                      "relative flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl border-2 text-sm font-semibold select-none",
                      isActive
                        ? cn(cfg.border, cfg.bg, cfg.color)
                        : "border-original-border-light text-original-text-muted bg-original-background-alt/50",
                    )}
                  >
                    {isActive && (
                      <span
                        className={cn(
                          "absolute top-2 end-2 w-1.5 h-1.5 rounded-full",
                          cfg.dot,
                        )}
                      />
                    )}
                    <LevelIcon size={16} />
                    <span className="text-xs">{t(`newRequest.steps.step2.urgency.${level}`)}</span>
                  </div>
                );
              })}
            </div>
            <div
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium",
                activeConfig.bg,
                activeConfig.color,
              )}
            >
              <ActiveIcon size={12} />
              {activeConfig.label}
            </div>
          </div>
        </div>

        {/* Section 2 — Service Details */}
        <div className="p-6 border rounded-2xl bg-card shadow-sm">
          <SectionHeader step="2" title={t("newRequest.steps.step2.serviceDetailsSection")} />

          <div className="space-y-4">
            <ReadOnlyField
              label={t("newRequest.steps.step2.serviceName")}
              value={subject}
              icon={IconFileDescription}
              required
            />

            <div className="space-y-1.5">
              <Label className="text-[11px] font-bold tracking-widest uppercase text-muted-foreground/70">
                {t("newRequest.steps.step2.serviceDescription")}
              </Label>
              <Textarea
                readOnly
                value={
                  selectedService?.description || t("newRequest.steps.step2.noDescription")
                }
                className={cn(
                  "resize-none min-h-[80px] text-sm bg-original-background-alt/60",
                  "border-dashed border-original-border rounded-xl text-original-text-muted",
                  "focus-visible:ring-0 focus-visible:ring-offset-0 cursor-default",
                )}
              />
            </div>

            {/* Required Documents */}
            {(selectedService?.requiredDocuments?.length ?? 0) > 0 && (
              <div className="space-y-2">
                <Label className="text-[11px] font-bold tracking-widest uppercase text-muted-foreground/70">
                  {t("newRequest.steps.step2.requiredDocuments")}
                </Label>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {selectedService?.requiredDocuments?.map(
                    (doc: string, i: number) => (
                      <div
                        key={i}
                        className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border border-dashed border-original-border bg-original-background-alt/60"
                      >
                        <div className="flex items-center justify-center w-6 h-6 rounded-md bg-primary/10 shrink-0">
                          <IconFileText size={13} className="text-primary" />
                        </div>
                        <span className="text-xs font-medium text-original-text-muted leading-tight">
                          {doc}
                        </span>
                        <span className="ms-auto text-[10px] font-bold text-original-text-muted">
                          #{i + 1}
                        </span>
                      </div>
                    ),
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
