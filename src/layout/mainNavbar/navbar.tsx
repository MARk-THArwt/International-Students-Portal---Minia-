import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import Logo from "@/assets/Minya University Logo.jpg";
import LoginIcon from "@mui/icons-material/Login";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { selectIsAuthenticated } from "@/store/slices/authSlice";
import { LanguageSwitcher } from "../../component/LanguageSwitcher/LanguageSwitcher";
import { ThemeToggle } from "@/components/theme-toggle";
import "./navbar.css";
import { Outlet } from "react-router-dom";
const MainNav = ({
  navigation,
}: {
  navigation: { title: string; path: string }[];
}) => {
  const { t } = useTranslation();
  const [state, setState] = useState(false);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  return (
    <>
      <nav className="bg-original-card w-full border-original-border md:border-b md:static">
        <div className="items-center px-4 w-full mx-auto md:flex md:px-8">
          {/* HEADER */}
          <div className="flex items-center justify-between py-1 md:py-2 md:block">
            <div className="flex gap-1 md:gap-2 items-center">
              <Link to="/">
                <img
                  src={Logo}
                  className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 rounded-full"
                  alt="Minia University logo"
                />
              </Link>
              <div>
                <h1 className="m-0 text-lg sm:text-xl md:text-2xl font-bold text-original-text-dark">
                  {t("miniaUniversity")}
                </h1>
                <p className="m-0 text-[10px] sm:text-xs md:text-sm font-medium text-original-primary">
                  {t("internationalStudentsPortal")}
                </p>
              </div>
            </div>

            {/* MOBILE MENU BUTTON */}
            <div className="md:hidden">
              <button
                className="text-original-text outline-none p-2 rounded-md focus:border-original-text-muted/70 focus:border"
                onClick={() => setState(!state)}
              >
                {state ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 8h16M4 16h16"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* MENU */}
          <div
            className={`flex-1 justify-self-center mt-4 md:block md:mt-0 ${state ? "block pb-4" : "hidden"}`}
          >
            <ul className="justify-center items-center space-y-4 md:flex md:space-x-6 md:space-y-0 m-0 p-0 list-none">
              {navigation.map((item, idx) => (
                <li key={idx} className="text-center md:text-left">
                  <NavLink
                    to={item.path}
                    className="block py-2 md:py-0 font-medium text-original-text-muted hover:text-original-primary transition-colors no-underline"
                  >
                    {t(item.title.toLowerCase())}
                  </NavLink>
                </li>
              ))}
            </ul>

            {/* MOBILE RIGHT SIDE */}
            <div className="mt-6 flex flex-col items-center gap-4 md:hidden">
              <div className="flex items-center gap-4">
                <ThemeToggle />
                <LanguageSwitcher />
              </div>
              <Link
                to={isAuthenticated ? "/dashboard" : "/Login"}
                style={{ textDecoration: "none", fontSize: "16px" }}
                className="flex justify-center items-center w-full max-w-[200px] py-2 px-4 text-white bg-original-primary hover:bg-original-primary-active rounded-md shadow gap-1"
              >
                <LoginIcon /> {isAuthenticated ? t("dashboard") : t("login")}
              </Link>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="hidden md:inline-block">
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <ThemeToggle />
              <LanguageSwitcher />
              <Link
                to={isAuthenticated ? "/dashboard" : "/Login"}
                style={{ textDecoration: "none", fontSize: "16px" }}
                className="flex py-1.5 px-4 text-white bg-original-primary hover:bg-original-primary-active rounded-md shadow gap-1"
              >
                <LoginIcon />
                {isAuthenticated ? t("dashboard") : t("login")}
              </Link>
            </div>
          </div>
        </div>
      </nav>
      <Outlet />
    </>
  );
};

export default MainNav;
