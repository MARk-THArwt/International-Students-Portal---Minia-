import { useEffect, useRef, useState, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks/hook";
import { getAllServices } from "../../store/AsyncThunks/servicesThunks";
import { selectAllServices, selectServicesLoading } from "../../store/slices/servicesslice";
import { useNavigate } from "react-router-dom";
import { ChevronDown, Search, Loader2, FileText, Plus } from "lucide-react";
import { useTranslation } from "react-i18next";

export function CreateRequestDropdown() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const services = useAppSelector(selectAllServices);
  const isLoading = useAppSelector(selectServicesLoading);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      // Fetch services if not already loaded
      if (services.length === 0 && !isLoading) {
        dispatch(getAllServices());
      }
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, services.length, isLoading, dispatch]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    if (!isOpen) setSearchQuery(""); // Reset search on open
  };

  const handleSelectService = (serviceId: string, serviceName: string) => {
    setIsOpen(false);
    // Navigate to new request route, passing the selected service in state
    navigate("/newRequest", { state: { serviceId, serviceName } });
  };

  const filteredServices = useMemo(() => {
    return services.filter((svc) =>
      svc.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [services, searchQuery]);

  return (
    <div className="relative inline-block text-start" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="flex items-center gap-2 px-4 py-2 bg-[#0A1931] hover:bg-[#0A1931]/90 text-white font-semibold rounded-lg shadow-md transition-all active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#0A1931]/50"
      >
        <Plus className="w-4 h-4" />
        {t("createRequest")}
        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute end-0 mt-2 w-72 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 overflow-hidden transform origin-top-right animate-in fade-in zoom-in duration-200">
          <div className="p-3 border-b border-gray-50 bg-gray-50/50">
            <h3 className="text-sm font-bold text-gray-800 mb-2">{t("selectService")}</h3>
            <div className="relative">
              <Search className="absolute start-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder={t("searchServices")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full ps-8 pe-3 py-1.5 bg-white border border-gray-200 rounded-md text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors placeholder:text-gray-400"
              />
            </div>
          </div>

          <div className="max-h-60 overflow-y-auto overscroll-contain p-2 space-y-1">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-6">
                <Loader2 className="w-6 h-6 text-blue-600 animate-spin mb-2" />
                <span className="text-xs text-gray-500 font-medium">{t("loadingServices")}</span>
              </div>
            ) : filteredServices.length > 0 ? (
              filteredServices.map((svc) => (
                <button
                  key={svc._id}
                  onClick={() => handleSelectService(svc._id, svc.name)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-start rounded-lg hover:bg-blue-50 transition-colors group focus:outline-none focus:bg-blue-50"
                >
                  <div className="w-8 h-8 rounded-full bg-gray-100 group-hover:bg-blue-100 group-hover:text-blue-600 text-gray-500 flex items-center justify-center shrink-0 transition-colors">
                    {/* Placeholder for actual service icon if available */}
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate group-hover:text-blue-900 transition-colors">
                      {svc.name}
                    </p>
                    {svc.category && (
                      <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider truncate">
                        {svc.category}
                      </p>
                    )}
                  </div>
                </button>
              ))
            ) : (
              <div className="py-8 text-center px-4">
                <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-2 text-gray-400">
                  <FileText className="w-5 h-5" />
                </div>
                <p className="text-sm font-semibold text-gray-700">{t("noServicesFound")}</p>
                <p className="text-xs text-gray-500 mt-1">{t("tryDifferentSearch")}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
