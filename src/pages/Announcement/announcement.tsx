import { Button } from "@/components/ui/button";
import MaxContainerWrapper from "@/reusable-components/max-containerWrap";
import { ArrowRight } from "lucide-react";
// import { STEP_2 } from "./steps/step2";
import STEP_3 from "./steps/step3";
import { Stepper } from "./stepper";
import STEP_4 from "./steps/step4";

export const Announcement = () => {
  return (
    <div className="min-h-screen py-10 bg-gray-300/40">
      <MaxContainerWrapper className="flex flex-col justify-center items-center gap-5 ">
        {/* <Stepper activeStep={3} /> */}
        {/* <STEP_1 /> */}
        {/* <STEP_2 /> */}
        {/* <STEP_3 /> */}
        <STEP_4 />
        <div className="flex justify-end mt-10 mx-9">
          <Button className="ml-auto px-8 h-12 bg-blue-800 transition duration-300 hover:bg-blue-900 active:scale-95 text-[16px] font-semibold leading-6">
            Next <ArrowRight />
          </Button>
        </div>
      </MaxContainerWrapper>
    </div>
  );
};
