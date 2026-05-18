import logo from "@/assets/Minya University Logo.jpg";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Link } from "react-router-dom";
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
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "../../store/store";
import {
  login,
  selectAuthLoading,
  selectAuthError,
  selectIsAuthenticated,
} from "../../store/slices/authSlice";
import { useNavigate } from "react-router-dom";

// ───────────────────────────────────────────────────────────────────────────────

export const Login = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const loading = useSelector(selectAuthLoading("login"));
  const error = useSelector(selectAuthError);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const role = (formData.get("role") as string) || "student";

    const result = await dispatch(login({ email, password, role }));

    if (login.fulfilled.match(result)) {
      navigate("/dashboard");
    }
  };

  return (
    <section className="grid grid-cols-1 lg:grid-cols-2 w-screen min-h-dvh text-white">
      {/* LEFT SIDE */}
      <div className="hidden lg:block bg-linear-to-br from-original-secondary via-original-login-gradient-via to-black/90 h-full relative">
        <div className="size-28 flex bg-original-login-overlay text-white ring-1 ring-white/10 dark:ring-white/5 justify-center items-center absolute rounded-full m-16 backdrop-blur-3xl ">
          <Link to="/" >
            <img src={logo} alt="logo" className="size-24 rounded-full" />
          </Link>
        </div>

        <div className="h-[calc(100dvh-64px-64px-114px)] mt-60.5 flex justify-between items-start flex-col px-16">
          <div className="flex flex-col gap-3">
            <p className="text-start w-full text-[60px] leading-15 font-bold bg-linear-to-bl from-original-accent to-original-accent/40 bg-clip-text text-transparent">
              {t("loginPage.excellenceTitle")}
            </p>
            <div className="border-s-2 ps-3 text-white border-original-accent/50 overflow-hidden">
              <p>
                {t("loginPage.excellenceDesc")}
              </p>
            </div>
          </div>

          <ul className="flex gap-4 justify-center items-center uppercase">
            <li className="flex gap-1 items-center font-bold text-original-primary-light text-[12px]">
              <FlaskConical className="text-original-accent size-5" /> {t("loginPage.research")}
            </li>
            <li className="flex gap-1 items-center font-bold text-original-primary-light text-[12px]">
              <PiBankLight className="text-original-accent size-5" />
              {t("loginPage.culture")}
            </li>
            <li className="flex gap-1 items-center font-bold text-original-primary-light text-[12px]">
              <Lightbulb className="text-original-accent size-5" />
              {t("loginPage.innovation")}
            </li>
          </ul>

          <p className="flex justify-center items-center gap-1 text-center w-full">
            <Globe />
            {t("loginPage.officialPortal")}
          </p>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="bg-original-background-alt px-3 flex justify-center items-center text-original-text-dark">
        <div className="mx-auto w-full max-w-md">
          <div className="mb-10 w-60.5 text-[26px] space-y-2 leading-8 tracking-tighter font-bold mx-auto text-center">
            <h3>{t("miniaUniversity")}</h3>
            <div className="text-original-primary-active flex items-center gap-2">
              <Separator className="flex-1 bg-original-primary-light" />
              <span className="text-sm font-bold text-[11px] uppercase tracking-[2.2px]">
                {t("footer.internationalPortal")}
              </span>
              <Separator className="flex-1 bg-original-primary-light" />
            </div>
          </div>

          <div className="rounded-xl pt-1.5 w-full shadow-2xl dark:shadow-black/40 overflow-hidden bg-linear-to-r from-original-primary-active via-original-primary-light to-original-primary-active">
            <div className="bg-original-card px-3 py-5 md:p-10">
              <form onSubmit={handleSubmit} className="flex flex-col gap-8">
                <div className="flex flex-col items-center">
                  <div className="bg-original-background-alt rounded-full">
                    <MdLockPerson className="m-2 size-7" />
                  </div>
                    <h4>{t("loginPage.secureLogin")}</h4>
                  <p className="text-center">
                    {t("loginPage.secureLoginDesc")}
                  </p>
                </div>

                <div className="flex flex-col gap-4 w-full text-original-text">
                  {/* Email */}
                  <Field>
                    <FieldLabel>{t("loginPage.email")}</FieldLabel>
                    <InputGroup className="bg-original-background-alt rounded-md py-3">
                      <InputGroupInput
                        name="email"
                        placeholder={t("loginPage.emailPlaceholder")}
                        className="ps-3!"
                      />
                      <InputGroupAddon>
                        <IdCardLanyardIcon />
                      </InputGroupAddon>
                    </InputGroup>
                  </Field>

                  {/* Password */}
                  <Field>
                    <FieldLabel>{t("loginPage.password")}</FieldLabel>
                    <InputGroup className="bg-original-background-alt rounded-md py-3">
                      <InputGroupInput
                        name="password"
                        type="password"
                        placeholder="••••••••"
                        className="ps-3!"
                      />
                      <InputGroupAddon>
                        <LockKeyhole />
                      </InputGroupAddon>
                      <InputGroupAddon align="inline-end">
                        <Eye />
                      </InputGroupAddon>
                    </InputGroup>
                  </Field>
                  {/* role */}
                  <Field>
                    <FieldLabel>{t("loginPage.role")}</FieldLabel>
                    <select
                      name="role"
                      className="bg-original-background-alt rounded-md py-1 px-3 w-full"
                      defaultValue="student"
                    >
                      <option value="student">{t("loginPage.roles.student")}</option>
                      <option value="staff">{t("loginPage.roles.staff")}</option>
                      <option value="admin">{t("loginPage.roles.admin")}</option>
                    </select>
                  </Field>
                  {/* Error */}
                  {error && (
                    <p className="text-original-danger text-sm text-center">{error}</p>
                  )}

                  {/* Button */}
                  <Button
                    type="submit"
                    disabled={loading}
                    className="rounded-md py-2.5 flex justify-center items-center text-white bg-original-primary-hover hover:bg-original-primary-hover/80 text-sm"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="animate-spin size-4" />
                        {t("loginPage.signingIn")}
                      </>
                    ) : (
                      <>
                        <LogIn className="size-4" />
                        {t("loginPage.signIn")}
                      </>
                    )}
                  </Button>
                </div>
              </form>

              {/* OR */}
              <div className="text-muted-foreground/70 my-3 flex items-center gap-2">
                <Separator className="flex-1 bg-muted-foreground/60" />
                <span className="text-sm font-bold text-[11px] uppercase tracking-[2.2px]">
                  {t("loginPage.orContinueWith")}
                </span>
                <Separator className="flex-1 bg-muted-foreground/60" />
              </div>

              {/* SSO */}
              <div className="flex justify-center">
                <Button variant="outline" className="text-sm">
                  <GraduationCap className="bg-original-background-alt p-1" />
                  {t("loginPage.loginSSO")}
                </Button>
              </div>
            </div>

            <div className="bg-original-background-alt px-8 py-3 flex justify-between">
              <p className="text-[12px] font-semibold">{t("loginPage.sslSecure")}</p>
              <div className="flex gap-3">
                <p className="text-[12px] font-semibold">{t("loginPage.privacy")}</p>
                <p className="text-[12px] font-semibold">{t("loginPage.terms")}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
