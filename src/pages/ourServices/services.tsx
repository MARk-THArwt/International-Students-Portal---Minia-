import { useEffect } from "react";
import MainNav from "../../layout/mainNavbar/navbar";
import Footer from "../../layout/mainFooter/footer";
import ServiceCard from "../../component/common/card/ServiceCard";
import AdmissionImg from "@/assets/admision.png";
import AdmissionIcon from "@/assets/icons-svg/Admission-Office.svg?react";
import { useAppDispatch, useAppSelector } from "./../../store/hooks/hook";
import { getServices } from "../../store/AsyncThunks/servicesThunks";
import {
  selectAllServices,
  selectFetchStatus,
  selectFetchError,
} from "../../store/slices/servicesslice";
const navigation = [
  { title: "Home", path: "/" },
  { title: "Admissions", path: "/Admissions" },
  { title: "Academics", path: "/Academics" },
  { title: "Student Life", path: "/Student Life" },
];

const serviceCards = [
  {
    data: {
      span: "Academic",
      title: "Admission Office",
      description:
        "Start your journey with us. Apply for undergraduate and postgraduate programs, track your application status, and manage enrollment documents.",
      imgServ: AdmissionImg,
      link: "Access Portal",
    },
    children: <AdmissionIcon />,
  },
  {
    data: {
      span: "Academic",
      title: "Admission Office",
      description:
        "Start your journey with us. Apply for undergraduate and postgraduate programs, track your application status, and manage enrollment documents.",
      imgServ: AdmissionImg,
      link: "Access Portal",
    },
    children: <AdmissionIcon />,
  },
  {
    data: {
      span: "Academic",
      title: "Admission Office",
      description:
        "Start your journey with us. Apply for undergraduate and postgraduate programs, track your application status, and manage enrollment documents.",
      imgServ: AdmissionImg,
      link: "Access Portal",
    },
    children: <AdmissionIcon />,
  },
  {
    data: {
      span: "Academic",
      title: "Admission Office",
      description:
        "Start your journey with us. Apply for undergraduate and postgraduate programs, track your application status, and manage enrollment documents.",
      imgServ: AdmissionImg,
      link: "Access Portal",
    },
    children: <AdmissionIcon />,
  },
  {
    data: {
      span: "Academic",
      title: "Admission Office",
      description:
        "Start your journey with us. Apply for undergraduate and postgraduate programs, track your application status, and manage enrollment documents.",
      imgServ: AdmissionImg,
      link: "Access Portal",
    },
    children: <AdmissionIcon />,
  },
  {
    data: {
      span: "Academic",
      title: "Admission Office",
      description:
        "Start your journey with us. Apply for undergraduate and postgraduate programs, track your application status, and manage enrollment documents.",
      imgServ: AdmissionImg,
      link: "Access Portal",
    },
    children: <AdmissionIcon />,
  },
];

export const Services = () => {
  const dispatch = useAppDispatch();

  const services = useAppSelector(selectAllServices);
  const status = useAppSelector(selectFetchStatus);
  const error = useAppSelector(selectFetchError);

  useEffect(() => {
    if (status === "idle") {
      dispatch(getServices());
    }
  }, [dispatch, status]);
  return (
    <>
      <MainNav navigation={navigation} />
      <div className="bg-[#F8F8FC] p-10">
        <div className="p-4 w-full flex flex-col gap-6">
          <h1 className="text-5xl font-black">Our Services</h1>
          <p className="p-0 leading-6 w-5/12 text-[#4C4C9A]">
            Comprehensive support and resources designed to assist international
            students throughout their academic journey at Minia University.
          </p>
        </div>
        <div className="grid gap-5 justify-items-center grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 p-8">
          {serviceCards.map((card, index) => (
            <ServiceCard key={index} data={card.data}>
              {card.children}
            </ServiceCard>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
};
