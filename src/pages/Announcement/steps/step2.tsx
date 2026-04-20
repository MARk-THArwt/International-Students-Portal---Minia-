import { Button } from "@/components/ui/button";
import { useState } from "react";

import { DatePicker } from "@/components/DatePicker";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

export const STEP_2 = () => {
  const [urgency, setUrgency] = useState<"Normal" | "Urgent" | "Critical">(
    "Normal",
  );
  const [subject, setSubject] = useState("");
  const [reason, setReason] = useState("");
  const [previousRef, setPreviousRef] = useState("");
  const [serviceType, setServiceType] = useState("");
  const [deliveryPreference, setDeliveryPreference] = useState(
    "Digital Copy (Email)",
  );

  const charCount = reason.length;

  const handleNext = () => {
    console.log({
      serviceType,
      urgency,
      // date,
      deliveryPreference,
      subject,
      reason,
      previousRef,
    });
    // Add your form submission logic here
  };

  return (
    <div className="max-w-4xl p-8 mx-auto md:shadow-sm md:border md:bg-card rounded-2xl">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">
            Service Details
          </h1>
          <p className="mt-2 text-muted-foreground">
            Please provide the specifics of your request so we can process it
            efficiently.
          </p>
        </div>

        <div>
          <h2 className="pb-1 mb-4 text-sm font-medium tracking-widest uppercase border-b text-muted-foreground">
            REQUEST INFORMATION
          </h2>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="service-type">
                Service Type <span className="text-red-500">*</span>
              </Label>
              <Select value={serviceType} onValueChange={setServiceType}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a service type..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="visa">Visa Renewal</SelectItem>
                  <SelectItem value="transcript">Transcript Request</SelectItem>
                  <SelectItem value="enrollment">
                    Enrollment Verification
                  </SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Select the primary category for your request.
              </p>
            </div>

            <div className="space-y-2">
              <Label>
                Urgency Level <span className="text-red-500">*</span>
              </Label>
              <div className="flex gap-2">
                {(["Normal", "Urgent", "Critical"] as const).map((level) => (
                  <Button
                    key={level}
                    type="button"
                    variant={urgency === level ? "default" : "outline"}
                    onClick={() => setUrgency(level)}
                    className={cn(
                      "flex-1",
                      urgency === "Normal" &&
                        level === "Normal" &&
                        "bg-green-600 hover:bg-green-700 text-white border-green-600",
                    )}
                  >
                    {level === "Critical" && "⚠️ "}
                    {level}
                  </Button>
                ))}
              </div>
              {urgency == "Urgent" && (
                <p className="text-xs text-muted-foreground">
                  Urgent requests may require additional fees.
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Preferred Completion Date</Label>
              <DatePicker />
            </div>

            <div className="space-y-2">
              <Label>Delivery Preference</Label>
              <Select
                value={deliveryPreference}
                onValueChange={setDeliveryPreference}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Digital Copy (Email)">
                    Digital Copy (Email)
                  </SelectItem>
                  <SelectItem value="Physical Copy">
                    Physical Copy (Mail)
                  </SelectItem>
                  <SelectItem value="Both">Both</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="pt-6 ">
          <h2 className="pb-1 mb-4 text-sm font-medium tracking-widest uppercase border-b text-muted-foreground">
            DESCRIPTION & JUSTIFICATION
          </h2>

          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="subject">
                Subject Line <span className="text-red-500">*</span>
              </Label>
              <Select value={subject} onValueChange={setSubject}>
                <SelectTrigger>
                  <SelectValue placeholder="e.g., Visa renewal for Fall Semester 2026" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Visa renewal for Fall Semester 2026">
                    Visa renewal for Fall Semester 2026
                  </SelectItem>
                  <SelectItem value="Official Transcript Request">
                    Official Transcript Request
                  </SelectItem>
                  <SelectItem value="Enrollment Verification Letter">
                    Enrollment Verification Letter
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <div className="flex items-baseline justify-between">
                <Label htmlFor="reason">
                  Detailed Reason <span className="text-red-500">*</span>
                </Label>
                <span className="text-xs text-muted-foreground">
                  {charCount} / 500 characters
                </span>
              </div>
              <Textarea
                id="reason"
                placeholder="Please describe why you need this service..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="min-h-[140px] resize-y"
                maxLength={500}
              />
            </div>

            <div className="space-y-2">
              <Label>Previous Request Reference (Optional)</Label>
              <div className="relative">
                <Input
                  placeholder="#REQ-..."
                  value={previousRef}
                  onChange={(e) => setPreviousRef(e.target.value)}
                  className="pr-12"
                />
                <div className="absolute font-mono text-sm -translate-y-1/2 right-3 top-1/2 text-muted-foreground">
                  #
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                If this is related to a past request, enter the ID here.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
