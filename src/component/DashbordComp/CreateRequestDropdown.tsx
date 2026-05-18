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

  const handleSelectService = (serviceId: string) => {
    setIsOpen(false);
    // Navigate to new request route using query parameters to match sidebar behavior
    navigate(`/newRequest?serviceId=${serviceId}`);
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
        className="flex items-center gap-2 px-4 py-2 bg-original-secondary-hover hover:bg-original-secondary-hover/90 text-white font-semibold rounded-lg shadow-md transition-all active:scale-95 focus:outline-none focus:ring-2 focus:ring-original-secondary-hover/50"
      >
        <Plus className="w-4 h-4" />
        {t("createRequest")}
        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute end-0 mt-2 w-72 bg-original-card rounded-xl shadow-2xl border border-original-border-light z-50 overflow-hidden transform origin-top-right animate-in fade-in zoom-in duration-200">
          <div className="p-3 border-b border-original-border-light bg-original-background-alt/50">
            <h3 className="text-sm font-bold text-original-text mb-2">{t("selectService")}</h3>
            <div className="relative">
              <Search className="absolute start-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-original-text-muted/70" />
              <input
                type="text"
                placeholder={t("searchServices")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full ps-8 pe-3 py-1.5 bg-original-card border border-original-border rounded-md text-sm outline-none focus:border-original-primary focus:ring-1 focus:ring-original-primary transition-colors placeholder:text-original-text-muted/70"
              />
            </div>
          </div>

          <div className="max-h-60 overflow-y-auto overscroll-contain p-2 space-y-1">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-6">
                <Loader2 className="w-6 h-6 text-original-primary animate-spin mb-2" />
                <span className="text-xs text-original-text-muted font-medium">{t("loadingServices")}</span>
              </div>
            ) : filteredServices.length > 0 ? (
              filteredServices.map((svc) => (
                <button
                  key={svc._id}
                  onClick={() => handleSelectService(svc._id)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-start rounded-lg hover:bg-original-background-alt text-original-primary transition-colors group focus:outline-none focus:bg-original-background-alt text-original-primary"
                >
                  <div className="w-8 h-8 rounded-full bg-original-background-alt group-hover:bg-original-background-alt text-original-primary group-hover:text-original-primary text-original-text-muted flex items-center justify-center shrink-0 transition-colors">
                    {/* Placeholder for actual service icon if available */}
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-original-text truncate group-hover:text-original-secondary transition-colors">
                      {svc.name}
                    </p>
                    {svc.category && (
                      <p className="text-[10px] font-medium text-original-text-muted/70 uppercase tracking-wider truncate">
                        {svc.category}
                      </p>
                    )}
                  </div>
                </button>
              ))
            ) : (
              <div className="py-8 text-center px-4">
                <div className="w-10 h-10 bg-original-background-alt rounded-full flex items-center justify-center mx-auto mb-2 text-original-text-muted/70">
                  <FileText className="w-5 h-5" />
                </div>
                <p className="text-sm font-semibold text-original-text">{t("noServicesFound")}</p>
                <p className="text-xs text-original-text-muted mt-1">{t("tryDifferentSearch")}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
