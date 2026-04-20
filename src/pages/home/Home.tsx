import React from 'react'
import ServicesCard from '../../component/common/card/card';
import MainNav from '../../layout/mainNavbar/navbar'
import Footer from '../../layout/mainFooter/footer'
import { Link } from 'react-router-dom';
import AdmissionLogo from '../../assets/icons-svg/admission-guide.svg?react'
import VisaLogo from './../../assets/icons-svg/Visa.svg?react'
import CampusLogo from './../../assets/icons-svg/Campus-Housing.svg?react'
import LastestNews from './../../assets/icons-svg/lastestNews.svg?react'
import Arow from '../../assets/icons-svg/arow.svg?react'
import LibraryIcon from './../../assets/icons-svg/Library.svg?react'
import SportCenerIcon from '../../assets/icons-svg/sportCenter.svg?react'
import LabIcon from '../../assets/icons-svg/Lab.svg?react'
import Map from '../../assets/icons-svg/map.svg?react'
import Dot from '../../assets/icons-svg/dot.svg?react'
import Virtual from '../../assets/icons-svg/virtual.svg?react'
import ExploreArrow from '../../assets/icons-svg/exploreArrow.svg?react'
import BackgraundImage from '@/assets/Background+Shadow.jpg'
import logo from '@/assets/Minya University Logo.jpg'


const navigation = [
      { title: "Home", path: "/" },
      { title: "Services", path: "/Services" },
      { title: "Announcements", path: "/Announcements" },
      { title: "Contact", path: "/Contact" }
  ]
export const Home = () => {
  return (
    <>
    <MainNav navigation={navigation}/>
    <div className="flex flex-col gap-12 w-full p-4 font-['Public_Sans']">

  {/* head */}
  <div className="flex flex-col md:flex-row p-4 min-h-full">

    {/* left */}
    <div className="w-full md:w-1/2 flex flex-col gap-[0.3rem] md:pr-[8rem]">

      {/* acadmic */}
      <div className="flex items-center w-[35%] gap-[0.3rem] text-[12px] font-bold leading-[16px] text-[#0F0FBD] bg-[rgba(15,15,189,0.1)] px-3 py-[4px] rounded-full">
        <Dot />
        Academic Year 2025-2026
      </div>

      {/* titles */}
      <h1 className="font-[Arial] font-extrabold text-[44px] leading-[48px] text-[#0D0D1C] m-0">
        Start Your Global
      </h1>
      <h1 className="font-[Arial] font-extrabold text-[44px] leading-[48px] text-[#0D0D1C] m-0">
        Journey at
      </h1>

      {/* title special */}
      <h1 className="font-[Arial] font-extrabold text-[44px] leading-[48px] text-[#0909AA] w-fit border-b-[8px] border-[#FFD700] pb-[10px] m-0">
        Minia University
      </h1>

      {/* paragraph */}
      <p className="text-[18px] leading-[29.25px] text-[#475569]">
        Welcome to the Minia University International Students Portal. Your journey to academic success starts here with world-class programs and a supportive community.
      </p>

      {/* buttons */}
      <div className="flex text-[16px] leading-[24px] p-2 gap-2">

        <Link
          to="/"
          className="flex gap-[5px] items-center justify-center w-[11.9rem] h-[3rem] p-4 rounded-lg bg-[#0F0FBD] text-white no-underline"
        >
          Explore Services <ExploreArrow />
        </Link>

        <Link
          to="/"
          className="flex gap-[5px] items-center justify-center w-[11.9rem] h-[3rem] p-4 rounded-lg border border-[#E2E8F0] text-[#002147] no-underline"
        >
          <Virtual /> Virtual Tour
        </Link>

      </div>

      {/* numbers */}
      <div className="flex w-1/2 gap-8 mt-2">
        <div className="text-center">
          <p className="m-0 font-black text-[30px] leading-[36px] text-[#002147]">15K+</p>
          <p className="font-medium text-[14px] leading-[20px] text-[#64748B]">Students</p>
        </div>

        <div className="text-center">
          <p className="m-0 font-black text-[30px] leading-[36px] text-[#002147]">120+</p>
          <p className="font-medium text-[14px] leading-[20px] text-[#64748B]">Programs</p>
        </div>

        <div className="text-center">
          <p className="m-0 font-black text-[30px] leading-[36px] text-[#002147]">45</p>
          <p className="font-medium text-[14px] leading-[20px] text-[#64748B]">Countries</p>
        </div>
      </div>
    </div>

    {/* right */}
    <div className="w-full md:w-1/2 md:pl-[3rem] flex items-center justify-center relative">

      <div className="relative w-full h-1/2 lg:h-full flex items-center justify-center p-1 lg:p-8">

        {/* gradient */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(15,15,189,0.05),rgba(197,160,89,0.1))] rotate-[178deg] rounded-lg"></div>

        {/* image */}
        <img
          src={BackgraundImage}
          className="relative object-cover rounded-3xl"
        />

        {/* floating card */}
        <div className="absolute bottom-4 left-4 lg:bottom-9 lg:left-12 bg-white/50 border-l-4 border-[#C5A059] backdrop-blur-[2px] rounded-2xl p-2 lg:p-5 w-3/4 lg:w-70">

          <div className="flex items-start gap-3">
            <img src={logo} className="w-12 h-12 rounded-full" />

            <div>
              <span className="font-bold text-[#002147]">
                Excellence in Education
              </span>

              <p className="text-[#475569] text-sm mt-1">
                Join a community dedicated to innovation and research across 18 faculties.
              </p>
            </div>

          </div>

        </div>

      </div>
    </div>
  </div>
  {/* news */}
       <div className="flex items-center bg-[rgba(197,160,89,0.1)] border-l-4 border-[#C5A059] rounded-lg h-[52px] px-4"> 
        <div className="w-2/12 flex items-center gap-1">
         <LastestNews /> <p className="text-[#C5A059] font-bold text-sm uppercase tracking-wide"> Latest News </p>
          </div> <div className="w-8/12 flex gap-1 text-sm"> <p className="text-[#002147] font-medium"> Registration for the Spring Semester 2026 is now open. </p>
           <p className="text-[#002147] font-bold"> Deadline: March 15th. </p>
            </div>
             <div className="w-2/12">
              <Link to="/" className="flex items-center gap-1 text-[#0F0FBD] font-bold text-sm"> Read details <Arow /> </Link>
               </div>
                </div>
                 {/* services */}
                  <div className="flex flex-col gap-6">
                     <div className="flex border-b border-[#E2E8F0] p-4">
                       <div className="w-10/12"> <h2 className="text-[#002147] font-bold text-3xl"> Student Services </h2>
                        <p className="text-[#64748B] text-base"> Comprehensive support for your acadimic journey </p>
                         </div> <div className="flex items-end ml-auto">
                           <Link to="/" className="text-[#0F0FBD] font-bold text-sm"> View All Services </Link>
                            </div>
                             </div>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                 <ServicesCard data={{ title: "Admission Guide", description: "Step-by-step procedures for international applicants, including document requirements and…" }} > <AdmissionLogo className='fill-[#C5A059]'/>
                                  </ServicesCard> <ServicesCard data={{ title: "Visa Support", description: "Complete guidance on obtaining and renewing your student visa, residency permits, and legal…" }} > <VisaLogo className='fill-[#C5A059]'/> 
                                  </ServicesCard> <ServicesCard data={{ title: "Campus Housing", description: "Find comfortable accommodation on or off campus with our housing assistance program for…" }} > <CampusLogo className='fill-[#C5A059]'/>
                                   </ServicesCard>
                                    </div>
                                    </div>

  {/* map */}
  <div className="border border-[#F1F5F9] rounded-2xl bg-[#F8FAFC] p-8 flex flex-col md:flex-row gap-6">

    {/* left */}
    <div className="w-full md:w-7/12 flex flex-col gap-4 pr-8">

      <h2 className="font-bold text-2xl text-[#002147]">
        Find your way around campus
      </h2>

      <p className="text-[#475569]">
        Explore our interactive map to locate faculties, libraries, and student centers.
      </p>

      

      {/* map list */}
      <div className="flex flex-col gap-2">

        <div className="flex bg-white border border-[#F1F5F9] rounded-lg gap-[5px] items-center p-3">
          <LibraryIcon />
          <p className="m-0 font-medium text-[14px] text-[#002147]">Central Library</p>
        </div>

        <div className="flex bg-white border border-[#F1F5F9] rounded-lg gap-[5px] items-center p-3">
          <LabIcon />
          <p className="m-0 font-medium text-[14px] text-[#002147]">Science Labs Complex</p>
        </div>

        <div className="flex bg-white border border-[#F1F5F9] rounded-lg gap-[5px] items-center p-3">
          <SportCenerIcon />
          <p className="m-0 font-medium text-[14px] text-[#002147]">Sports Center</p>
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
          Open Interactive Map
        </span>

      </div>

    </div>

  </div>

</div>
    <Footer/>
    </>
  );
}
