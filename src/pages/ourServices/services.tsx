import { useEffect, useState } from "react";
import MainNav from "../../layout/mainNavbar/navbar";
import Footer from "../../layout/mainFooter/footer";
import ServiceCard from "../../component/common/card/ServiceCard";
import AdmissionImg from "../../assets/admision.png";
import AdmissionIcon from "@/assets/icons-svg/Admission-Office.svg?react";
import VisaIcon from "@/assets/icons-svg/Visa&Immigration.svg?react";
import HousingIcon from "@/assets/icons-svg/Campus-Housing.svg?react";
import { useAppDispatch, useAppSelector } from "./../../store/hooks/hook";
import { getAllServices } from "../../store/AsyncThunks/servicesThunks";
import {
  selectAllServices,
  selectServicesLoading,
  selectServicesStatus,
  selectServicesError,
} from "../../store/slices/servicesslice";
import { Search, Filter, CircleDollarSign, Home } from "lucide-react";

const navigation = [
  { title: "Home", path: "/" },
  { title: "Admissions", path: "/Admissions" },
  { title: "Academics", path: "/Academics" },
  { title: "Student Life", path: "/Student Life" },
];

export const Services = () => {
  const dispatch = useAppDispatch();

  const services = useAppSelector(selectAllServices);
  const status = useAppSelector(selectServicesStatus);
  const loading = useAppSelector(selectServicesLoading);
  const error = useAppSelector(selectServicesError);

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  useEffect(() => {
    if (status === "idle") {
      dispatch(getAllServices());
    }
  }, [status, dispatch]);

  const filteredServices = services.filter((service) => {
    const matchesSearch =
      service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || service.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const getCategoryIcon = (category: string) => {
    switch (category?.toLowerCase()) {
      case "education":
        return <AdmissionIcon className="w-6 h-6" />;
      case "visa":
        return <VisaIcon className="w-6 h-6" />;
      case "housing":
        return <Home className="w-6 h-6 text-blue-800" />;
      case "financial":
        return <CircleDollarSign className="w-6 h-6 text-blue-800" />;
      default:
        return <AdmissionIcon className="w-6 h-6" />;
    }
  };

  return (
    <>
      <MainNav navigation={navigation} />
      <div className="bg-[#F8F8FC] px-6 py-10 md:p-10">
        <div className="p-4 w-full flex flex-col gap-6">
          <h1 className="text-3xl md:text-5xl font-black">Our Services</h1>
          <p className="p-0 leading-6 w-full md:w-5/12 text-[#4C4C9A]">
            Comprehensive support and resources designed to assist international
            students throughout their academic journey at Minia University.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="max-w-7xl mx-auto mb-8">
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Search services..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <div className="flex items-center gap-2 text-slate-500 font-medium whitespace-nowrap">
                <Filter size={18} />
                Category:
              </div>
              <select
                className="w-full sm:w-auto bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-700 font-medium cursor-pointer"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="all">All Categories</option>
                <option value="education">Education</option>
                <option value="visa">Visa</option>
                <option value="housing">Housing</option>
                <option value="financial">Financial</option>
              </select>
            </div>
          </div>
        </div>
        <div className="grid gap-5 justify-items-center grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 p-8">
          {loading ? (
            <div className="col-span-full flex flex-col items-center py-20 gap-4">
              <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-[#4C4C9A] font-medium">Fetching services...</p>
            </div>
          ) : error ? (
            <div className="col-span-full py-20 text-center">
              <p className="text-red-500 font-bold">Error loading services</p>
              <p className="text-[#4C4C9A]">{error}</p>
            </div>
          ) : filteredServices.length === 0 ? (
            <div className="col-span-full py-20 text-center">
              <p className="text-[#4C4C9A] text-lg font-semibold">
                {services.length === 0
                  ? "No Services Available"
                  : "No services match your search or filter"}
              </p>
            </div>
          ) : (
            filteredServices.map((service, index) => (
              <ServiceCard
                key={service._id || index}
                data={{
                  span: service.category || "Academic",
                  title: service.name,
                  description: service.description,
                  imgServ: service.image || AdmissionImg,
                  link: "Access Portal",
                }}
              >
                {getCategoryIcon(service.category)}
              </ServiceCard>
            ))
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};
