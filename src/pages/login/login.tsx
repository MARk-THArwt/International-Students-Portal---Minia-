import logo from "@/assets/Minya University Logo.jpg";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Separator } from "@/components/ui/separator";
import {
  Eye,
  FlaskConical,
  Globe,
  GraduationCap,
  IdCardLanyardIcon,
  Lightbulb,
  Loader2,
  LockKeyhole,
  LogIn,
} from "lucide-react";
import { MdLockPerson } from "react-icons/md";
import { PiBankLight } from "react-icons/pi";
import { authClient } from "../../lib/auth-client";
import { useNavigate } from "react-router-dom";
import { useState, useTransition } from "react";
import { toast } from "sonner";

export const Login = () => {
  const navigate = useNavigate();
  const [isNavigating, startTransition] = useTransition();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      setIsSubmitting(true);
      const { error } = await authClient.signIn.email({
        email: email,
        password: password,
      });
      if (!error) startTransition(() => navigate("/"));
      throw new Error(error?.message);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="grid grid-cols-1 lg:grid-cols-2 w-screen min-h-dvh text-white">
      <div className="hidden lg:block bg-linear-to-br from-[#0F172A] via-[#0F0FBD] to-black/80 h-full relative">
        <div className="size-28 flex bg-blue-950 ring-1 ring-purple-900 justify-center items-center absolute rounded-full m-16 backdrop-blur-3xl ">
          <img src={logo} alt="logo" className="size-24 rounded-full" />
        </div>
        <div className="h-[calc(100dvh-64px-64px-114px)] mt-60.5 flex justify-between items-start flex-col px-16">
          <div className="flex flex-col gap-3">
            <p className="text-left w-full text-[60px] leading-15 font-bold bg-linear-to-bl from-[rgba(254,240,138,1)] to-90% to-pizza bg-clip-text text-transparent">
              Excellence in International Education
            </p>
            <div className="border-l-2 pl-3  text-white border-pizza/50 overflow-hidden">
              <p className="animate-slide-in-left animation-duration-500! ">
                Welcome to Minya University. A hub of innovation, culture, and
                academic distinction in the heart of Egypt.
              </p>
            </div>
          </div>
          <ul className=" -mt-15! flex gap-4 justify-center items-center *:uppercase pl-0!">
            <li className="flex gap-1 justify-center items-center font-bold leading-4  tracking-[1.2px] text-[#BFDBFE] text-[12px]">
              <FlaskConical className="text-pizza size-5 " /> research
            </li>
            <li className="flex gap-1 justify-center items-center font-bold leading-4  tracking-[1.2px] text-[#BFDBFE] text-[12px]">
              <PiBankLight className="text-pizza size-5 " />
              culture
            </li>
            <li className="flex gap-1 justify-center items-center font-bold leading-4  tracking-[1.2px] text-[#BFDBFE] text-[12px]">
              <Lightbulb className="text-pizza size-5 " />
              innovation
            </li>
          </ul>
          <p className="flex justify-center items-center gap-1 text-center w-full">
            <Globe />
            Official International Students Portal
          </p>
        </div>
      </div>

      <div className="bg-gray-100 px-3 flex justify-center items-center text-black">
        <div className=" mx-auto w-full max-w-md">
          <div className="mb-10 w-60.5 text-[26px] space-y-2! leading-8 tracking-tighter font-bold mx-auto text-center">
            <h3>Minia University</h3>
            <div className="text-blue-800  flex items-center gap-2">
              <Separator className="flex-1 bg-[#144BB8]" />
              <span className="text-sm font-bold text-[11px] uppercase tracking-[2.2px]">
                International Portal
              </span>
              <Separator className="flex-1 bg-[#144BB8] " />
            </div>
          </div>

          <div className="rounded-xl pt-1.5 w-full shadow-2xl shadow-gray-300 overflow-hidden bg-linear-to-r from-[#0D40A5] via-[#60A5FA] to-[#0D40A5]">
            <div className="bg-white px-3 py-5 md:p-10 ">
              <form
                onSubmit={handleSubmit}
                className="flex justify-center flex-col gap-8 "
                action=""
              >
                <div className="flex flex-col justify-center items-center">
                  <div className="bg-[#EFF6FF] rounded-full">
                    <MdLockPerson className="m-2 size-7 " />
                  </div>
                  <h4>Secure Login</h4>
                  <p className="w-full text-center">
                    Access your academic records securely.
                  </p>
                </div>
                <div className="flex flex-col gap-4 w-full text-gray-700">
                  <Field className="max-w-sm">
                    <FieldLabel htmlFor="inline-start-input">Email</FieldLabel>
                    <InputGroup className="bg-gray-100 rounded-md py-3">
                      <InputGroupInput
                        name="email"
                        id="inline-start-input"
                        placeholder="e.g. 2024001 or student@minia.edu.eg"
                        className="pl-3!"
                      />
                      <InputGroupAddon align="inline-start">
                        <IdCardLanyardIcon />
                      </InputGroupAddon>
                    </InputGroup>
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="inline-start-input">
                      <div className="flex justify-between">
                        <p className="m-0">Password</p>
                        <a>Forgot password?</a>
                      </div>
                    </FieldLabel>
                    <InputGroup className="bg-gray-100 rounded-md py-3">
                      <InputGroupInput
                        name="password"
                        id="inline-start-input"
                        placeholder="••••••••••••"
                        className="pl-3!"
                      />
                      <InputGroupAddon align="inline-start">
                        <LockKeyhole />
                      </InputGroupAddon>
                      <InputGroupAddon align="inline-end">
                        <Eye />
                      </InputGroupAddon>
                    </InputGroup>
                  </Field>

                  <Button
                    variant={"ghost"}
                    className="rounded-md! py-2.5! flex! justify-center! items-center! text-white bg-[#0909AA]
                  hover:bg-[#0909AA]/80 text-sm!"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="animate-spin size-4" />
                        Signing In
                      </>
                    ) : isNavigating ? (
                      <>
                        <Loader2 className="animate-spin size-4" />
                        Redirecting...
                      </>
                    ) : (
                      <>
                        <LogIn className="size-4" />
                        Sign In
                      </>
                    )}
                  </Button>
                </div>
              </form>
              <div className="text-muted-foreground/70 my-3 flex items-center gap-2">
                <Separator className="flex-1 p-px bg-muted-foreground/60" />
                <span className="text-sm font-bold text-[11px] uppercase tracking-[2.2px]">
                  OR CONTINUE WITH
                </span>
                <Separator className="flex-1 p-px bg-muted-foreground/60 " />
              </div>
              <div className="flex justify-center items-center">
                <Button
                  variant={"outline"}
                  className="rounded-md! mx-auto! shadow-xs text-sm font-medium leading-5 text-muted-foreground py-2.5"
                >
                  <GraduationCap className="rounded-full bg-[#EFF6FF] p-1 box-content!" />
                  Login with University SSO
                </Button>
              </div>
            </div>
            <div className="bg-gray-100 px-8 py-3 flex justify-between items-center">
              <p className="text-[12px] font-semibold m-0 leading-4">
                SSL secure
              </p>
              <div className="flex justify-center items-center gap-3">
                <p className="text-[12px] font-semibold m-0 leading-4">
                  Privacy
                </p>
                <p className="text-[12px] font-semibold m-0 leading-4">Terms</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
