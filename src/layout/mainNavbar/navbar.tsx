import React from "react";
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import Logo from "@/assets/Minya University Logo.jpg";
import LanguageIcon from "@mui/icons-material/Language";
import LoginIcon from "@mui/icons-material/Login";
import "./navbar.css";
import { SidebarTrigger } from "@/components/ui/sidebar";

const MainNav = ({
  navigation,
}: {
  navigation: { title: string; path: string }[];
}) => {
  const [state, setState] = useState(false);

  return (
    <nav className="bg-white w-full  border-[#E2E8F0] md:border-b md:static ">
      <div className="items-center px-4 w-full mx-auto md:flex md:px-8">
        <div className="flex items-center justify-between py-1 md:py-2 md:block">
          <div className="flex gap-1 items-center">
            <Link to="/">
              <img
                src={Logo}
                className="w-18 h-18 rounded-full "
                alt="Minia University logo"
              />
            </Link>
            <div className="subTitle">
              <h1>Minia University</h1>
              <p>International Students Partal</p>
            </div>
          </div>
          <SidebarTrigger className="md:hidden size-6" />
        </div>
        <div
          className={`flex-1 justify-self-center mt-8 md:block md:mt-0 ${state ? "block" : "hidden"}`}
        >
          <ul className="justify-center items-center space-y-8 md:flex md:space-x-6 md:space-y-0 m-0">
            {navigation.map((item, idx) => {
              return (
                <li key={idx}>
                  <NavLink
                    to={item.path}
                    style={{ textDecoration: "none", color: "#475569" }}
                  >
                    {item.title}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="hidden md:inline-block ">
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                color: "#475569",
                display: "flex",
                gap: "5px",
                fontSize: "16px",
              }}
            >
              <LanguageIcon />
              AR / EN
            </div>
            <Link
              to="/Login"
              style={{ textDecoration: "none", fontSize: "16px" }}
              className="flex py-1.5 px-4 text-white bg-[#0F0FBD] hover:bg-[#0c0ca0] rounded-md shadow gap-1"
            >
              <LoginIcon />
              Login
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};
export default MainNav;
