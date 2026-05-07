import ServicesCard from "../../component/common/card/card";
import Footer from "../../layout/mainFooter/footer";
import { Link } from "react-router-dom";
import AdmissionLogo from "../../assets/icons-svg/admission-guide.svg?react";
import VisaLogo from "./../../assets/icons-svg/Visa.svg?react";
import CampusLogo from "./../../assets/icons-svg/Campus-Housing.svg?react";
import LastestNews from "./../../assets/icons-svg/lastestNews.svg?react";
import Arow from "../../assets/icons-svg/arow.svg?react";
import LibraryIcon from "./../../assets/icons-svg/Library.svg?react";
import SportCenerIcon from "../../assets/icons-svg/sportCenter.svg?react";
import LabIcon from "../../assets/icons-svg/Lab.svg?react";
import Map from "../../assets/icons-svg/map.svg?react";
import Dot from "../../assets/icons-svg/dot.svg?react";
import Virtual from "../../assets/icons-svg/virtual.svg?react";
import ExploreArrow from "../../assets/icons-svg/exploreArrow.svg?react";
import BackgraundImage from "@/assets/Background+Shadow.jpg";
import logo from "@/assets/Minya University Logo.jpg";
import { useTranslation } from "react-i18next";


export const Home = () => {
  const { t } = useTranslation();
  return (
    <>
      <div className="flex flex-col gap-12 w-full p-4 font-['Public_Sans']">
        {/* head */}
        <div className="flex flex-col md:flex-row p-4 min-h-full">
          {/* left */}
          <div className="w-full md:w-1/2 flex flex-col gap-[0.3rem] md:pe-[8rem]">
            {/* acadmic */}
            <div className="flex items-center w-fit gap-[0.3rem] text-[12px] font-bold leading-[16px] text-[#0F0FBD] bg-[rgba(15,15,189,0.1)] px-3 py-[4px] rounded-full">
              <Dot />
              {t("academicYear")}
            </div>

            {/* titles */}
            <h1 className="font-[Arial] font-extrabold text-[32px] md:text-[44px] leading-[40px] md:leading-[48px] text-[#0D0D1C] m-0">
              {t("heroTitle1")}
            </h1>
            <h1 className="font-[Arial] font-extrabold text-[32px] md:text-[44px] leading-[40px] md:leading-[48px] text-[#0D0D1C] m-0">
              {t("heroTitle2")}
            </h1>

            {/* title special */}
            <h1 className="font-[Arial] font-extrabold text-[32px] md:text-[44px] leading-[40px] md:leading-[48px] text-[#0909AA] w-fit border-b-[8px] border-[#FFD700] pb-[10px] m-0">
              {t("heroTitle3")}
            </h1>

            {/* paragraph */}
            <p className="text-[18px] leading-[29.25px] text-[#475569]">
              {t("heroDesc")}
            </p>

            {/* buttons */}
            <div className="flex flex-col sm:flex-row text-[16px] leading-[24px] py-2 md:p-2 gap-3 sm:gap-2">
              <Link
                to="/"
                className="flex gap-[5px] items-center justify-center w-full sm:w-[11.9rem] h-[3rem] p-4 rounded-lg bg-[#0F0FBD] text-white no-underline"
              >
                {t("exploreServices")} <ExploreArrow />
              </Link>

              <Link
                to="/"
                className="flex gap-[5px] items-center justify-center w-full sm:w-[11.9rem] h-[3rem] p-4 rounded-lg border border-[#E2E8F0] text-[#002147] no-underline"
              >
                <Virtual /> {t("virtualTour")}
              </Link>
            </div>

            {/* numbers */}
            <div className="flex w-full sm:w-3/4 md:w-1/2 justify-between sm:justify-start gap-4 sm:gap-8 mt-6 md:mt-2">
              <div className="text-center">
                <p className="m-0 font-black text-[30px] leading-[36px] text-[#002147]">
                  15K+
                </p>
                <p className="font-medium text-[14px] leading-[20px] text-[#64748B]">
                  {t("stats.students")}
                </p>
              </div>

              <div className="text-center">
                <p className="m-0 font-black text-[30px] leading-[36px] text-[#002147]">
                  120+
                </p>
                <p className="font-medium text-[14px] leading-[20px] text-[#64748B]">
                  {t("stats.programs")}
                </p>
              </div>

              <div className="text-center">
                <p className="m-0 font-black text-[30px] leading-[36px] text-[#002147]">
                  45
                </p>
                <p className="font-medium text-[14px] leading-[20px] text-[#64748B]">
                  {t("stats.countries")}
                </p>
              </div>
            </div>
          </div>

          {/* right */}
          <div className="w-full md:w-1/2 md:ps-12 flex items-center justify-center relative mt-8 md:mt-0">
            <div className="relative w-full max-w-md md:max-w-full flex items-center justify-center p-2 sm:p-4 lg:p-8">
              {/* gradient */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(15,15,189,0.05),rgba(197,160,89,0.1))] rotate-[178deg] rounded-xl lg:rounded-2xl"></div>

              {/* image */}
              <img
                src={BackgraundImage}
                className="relative w-full h-auto object-cover rounded-2xl lg:rounded-3xl"
              />

              {/* floating card */}
              <div
                className="absolute bottom-3 start-3 sm:bottom-4 sm:start-4 lg:bottom-10 lg:start-12 
                    bg-white/60 border-s-4 border-[#C5A059] backdrop-blur-sm 
                    rounded-xl lg:rounded-2xl p-2 sm:p-3 lg:p-5 
                    w-[85%] sm:w-[75%] md:w-[70%] lg:w-[280px]"
              >
                <div className="flex items-start gap-2 sm:gap-3">
                  <img
                    src={logo}
                    className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-full"
                  />

                  <div>
                    <span className="font-bold text-[#002147] text-sm sm:text-base">
                      {t("excellenceTitle")}
                    </span>

                    <p className="text-[#475569] text-xs sm:text-sm mt-1 leading-relaxed">
                      {t("excellenceDesc")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* news */}
        <div className="flex flex-col md:flex-row items-start md:items-center bg-[rgba(197,160,89,0.1)] border-s-4 border-[#C5A059] rounded-lg h-auto md:h-[52px] px-4 py-3 md:py-0 gap-2 md:gap-0">
          <div className="w-full md:w-2/12 flex items-center gap-1">
            <LastestNews />{" "}
            <p className="text-[#C5A059] font-bold text-sm uppercase tracking-wide m-0">
              {" "}
              {t("latestNews")}{" "}
            </p>
          </div>{" "}
          <div className="w-full md:w-8/12 flex flex-col md:flex-row gap-1 text-sm">
            {" "}
            <p className="text-[#002147] font-medium m-0">
              {" "}
              {t("newsDesc1")}{" "}
            </p>
            <p className="text-[#002147] font-bold m-0"> {t("newsDesc2")} </p>
          </div>
          <div className="w-full md:w-2/12 flex justify-start md:justify-end mt-1 md:mt-0">
            <Link
              to="/"
              className="flex items-center gap-1 text-[#0F0FBD] font-bold text-sm no-underline"
            >
              {" "}
              {t("readDetails")} <Arow />{" "}
            </Link>
          </div>
        </div>
        {/* services */}
        <div className="flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center border-b border-[#E2E8F0] pb-4 gap-4 sm:gap-0">
            <div className="w-full sm:w-10/12">
              {" "}
              <h2 className="text-[#002147] font-bold text-2xl sm:text-3xl m-0">
                {" "}
                {t("studentServices")}{" "}
              </h2>
              <p className="text-[#64748B] text-base m-0 mt-1">
                {" "}
                {t("studentServicesDesc")}{" "}
              </p>
            </div>{" "}
            <div className="flex w-full sm:w-auto items-end sm:ms-auto justify-end sm:justify-start">
              <Link to="/" className="text-[#0F0FBD] font-bold text-sm no-underline">
                {" "}
                {t("viewAllServices")}{" "}
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ServicesCard
              data={{
                title: t("servicesList.admissionGuide"),
                description: t("servicesList.admissionGuideDesc"),
              }}
            >
              {" "}
              <AdmissionLogo className="fill-[#C5A059]" />
            </ServicesCard>{" "}
            <ServicesCard
              data={{
                title: t("servicesList.visaSupport"),
                description: t("servicesList.visaSupportDesc"),
              }}
            >
              {" "}
              <VisaLogo className="fill-[#C5A059]" />
            </ServicesCard>{" "}
            <ServicesCard
              data={{
                title: t("servicesList.campusHousing"),
                description: t("servicesList.campusHousingDesc"),
              }}
            >
              {" "}
              <CampusLogo className="fill-[#C5A059]" />
            </ServicesCard>
          </div>
        </div>

        {/* map */}
        <div className="border border-[#F1F5F9] rounded-2xl bg-[#F8FAFC] p-4 sm:p-8 flex flex-col md:flex-row gap-6">
          {/* left */}
          <div className="w-full md:w-7/12 flex flex-col gap-4 md:pe-8">
            <h2 className="font-bold text-2xl text-[#002147]">
              {t("campusMapTitle")}
            </h2>

            <p className="text-[#475569]">
              {t("campusMapDesc")}
            </p>

            {/* map list */}
            <div className="flex flex-col gap-2">
              <div className="flex bg-white border border-[#F1F5F9] rounded-lg gap-[5px] items-center p-3">
                <LibraryIcon />
                <p className="m-0 font-medium text-[14px] text-[#002147]">
                  {t("locations.centralLibrary")}
                </p>
              </div>

              <div className="flex bg-white border border-[#F1F5F9] rounded-lg gap-[5px] items-center p-3">
                <LabIcon />
                <p className="m-0 font-medium text-[14px] text-[#002147]">
                  {t("locations.scienceLabs")}
                </p>
              </div>

              <div className="flex bg-white border border-[#F1F5F9] rounded-lg gap-[5px] items-center p-3">
                <SportCenerIcon />
                <p className="m-0 font-medium text-[14px] text-[#002147]">
                  {t("locations.sportsCenter")}
                </p>
              </div>
            </div>
          </div>

          {/* right */}
          <div className="w-full md:w-5/12 flex items-center justify-center relative ">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d112600.76689370809!2d30.5822877!3d28.1229178!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x145b25c9ff4ca9db%3A0xb233ef3a6077958c!2sMinia%20University!5e0!3m2!1sen!2seg!4v1772907339299!5m2!1sen!2seg"
              className="w-full h-[250px] rounded-[20px] border-0"
            ></iframe>

            {/* badge */}
            <div className="absolute flex items-center justify-center gap-1 w-[13rem] h-[2.6rem] bg-white rounded-full ">
              <Map />
              <span className="font-bold text-[16px] text-[#002147]">
                {t("openInteractiveMap")}
              </span>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};
