import{ useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks/hook";
import { getEvents, selectEventsState, type Event } from "../../store/slices/eventsSlice";
import { useTranslation } from "react-i18next";
import { 
  Calendar, 
  MapPin, 
  Clock, 
  ChevronRight, 
  Search, 
  Filter, 
  Info,
  X,
  ExternalLink,
  ArrowRight,
  Sparkles
} from "lucide-react";

// --- REUSABLE COMPONENTS ---

/**
 * Loading Skeleton for Event Cards
 */
const SkeletonCard = () => (
  <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden animate-pulse">
    <div className="h-56 bg-gray-200" />
    <div className="p-6 space-y-4">
      <div className="h-6 bg-gray-200 rounded-lg w-3/4" />
      <div className="h-4 bg-gray-200 rounded-lg w-full" />
      <div className="h-4 bg-gray-200 rounded-lg w-5/6" />
      <div className="pt-4 flex justify-between items-center">
        <div className="h-4 bg-gray-100 rounded w-24" />
        <div className="h-8 bg-gray-100 rounded-xl w-24" />
      </div>
    </div>
  </div>
);

/**
 * Featured Event Hero Section
 */
const AnnouncementHero = ({ event, onClick }: { event: Event; onClick: () => void }) => {
  const { t } = useTranslation();
  const isRTL = document.documentElement.lang === "ar";

  return (
    <section 
      className="relative w-full h-[500px] md:h-[600px] rounded-[2rem] overflow-hidden group cursor-pointer shadow-2xl shadow-blue-900/10 mb-12"
      onClick={onClick}
    >
      {/* Background Image & Overlay */}
      {event.image ? (
        <img 
          src={event.image} 
          alt={event.title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-16 text-start">
        <div className="max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-500/20 backdrop-blur-md border border-white/20 rounded-full text-blue-300 text-xs font-bold uppercase tracking-widest animate-bounce">
            <Sparkles size={14} />
            {t("announcements.featured", { defaultValue: "Featured Announcement" })}
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black text-white leading-tight tracking-tight">
            {event.title}
          </h1>
          
          <p className="text-gray-200 text-lg md:text-xl line-clamp-2 max-w-2xl font-medium leading-relaxed opacity-90">
            {event.description}
          </p>

          <div className="flex flex-wrap items-center gap-6 pt-4 text-white/80">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur flex items-center justify-center border border-white/10">
                <Calendar size={18} />
              </div>
              <span className="font-semibold tracking-wide">
                {new Date(event.date).toLocaleDateString(isRTL ? "ar-EG" : "en-US", { 
                  month: 'long', day: 'numeric', year: 'numeric' 
                })}
              </span>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur flex items-center justify-center border border-white/10">
                <MapPin size={18} />
              </div>
              <span className="font-semibold tracking-wide">{event.location}</span>
            </div>
          </div>

          <button className="mt-8 px-8 py-4 bg-white text-blue-600 rounded-2xl font-bold hover:bg-blue-50 transition-all flex items-center gap-3 shadow-xl shadow-white/10 transform group-hover:translate-x-2 rtl:group-hover:-translate-x-2 duration-300">
            {t("announcements.viewDetails", { defaultValue: "Discover More" })}
            {isRTL ? <ChevronRight className="rotate-180" /> : <ChevronRight />}
          </button>
        </div>
      </div>
    </section>
  );
};

/**
 * Individual Event Card
 */
const EventCard = ({ event, onClick }: { event: Event; onClick: () => void }) => {
  const { t } = useTranslation();
  const isRTL = document.documentElement.lang === "ar";

  return (
    <div 
      className="group bg-white rounded-[2rem] border border-gray-100 overflow-hidden hover:shadow-2xl hover:shadow-blue-900/10 transition-all duration-500 flex flex-col h-full cursor-pointer"
      onClick={onClick}
    >
      {/* Image Container */}
      <div className="relative h-64 overflow-hidden">
        {event.image ? (
          <img 
            src={event.image} 
            alt={event.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-tr from-blue-500 to-indigo-600 opacity-80" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Date Badge Overlay */}
        <div className="absolute top-4 left-4 rtl:left-auto rtl:right-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl shadow-lg text-center min-w-[60px] border border-white/50">
          <span className="block text-blue-600 font-black text-xl leading-none">
            {new Date(event.date).getDate()}
          </span>
          <span className="text-[10px] uppercase font-bold text-gray-500 tracking-tighter">
            {new Date(event.date).toLocaleDateString(isRTL ? "ar-EG" : "en-US", { month: 'short' })}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-7 flex-1 flex flex-col text-start">
        <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-1">
          {event.title}
        </h3>
        <p className="text-gray-500 text-sm line-clamp-2 mb-6 leading-relaxed flex-1 font-medium">
          {event.description}
        </p>

        <div className="space-y-3 pb-6 border-b border-gray-50">
          <div className="flex items-center gap-3 text-xs font-bold text-gray-600">
            <div className="w-8 h-8 rounded-xl bg-gray-50 text-gray-400 flex items-center justify-center group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
              <MapPin size={14} />
            </div>
            {event.location}
          </div>
          <div className="flex items-center gap-3 text-xs font-bold text-gray-600">
            <div className="w-8 h-8 rounded-xl bg-gray-50 text-gray-400 flex items-center justify-center group-hover:bg-indigo-50 group-hover:text-indigo-500 transition-colors">
              <Clock size={14} />
            </div>
            {new Date(event.date).toLocaleTimeString(isRTL ? "ar-EG" : "en-US", { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
            {t("announcements.category", { defaultValue: "University News" })}
          </span>
          <button className="flex items-center gap-1.5 text-blue-600 font-bold text-sm group/btn">
            {t("announcements.readMore", { defaultValue: "Read More" })}
            <ArrowRight size={16} className="transform group-hover/btn:translate-x-1 rtl:group-hover/btn:-translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};

/**
 * Modal for Event Details
 */
const EventDetailsModal = ({ event, isOpen, onClose }: { event: Event | null; isOpen: boolean; onClose: () => void }) => {
  const { t } = useTranslation();
  if (!isOpen || !event) return null;
  const isRTL = document.documentElement.lang === "ar";

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={onClose} />
      
      <div className="relative bg-white w-full max-w-5xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh] animate-in zoom-in-95 duration-300">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 z-10 p-3 bg-white/20 backdrop-blur-xl hover:bg-white/40 rounded-full text-white transition-all border border-white/20"
        >
          <X size={20} />
        </button>

        {/* Left Side - Image */}
        <div className="w-full md:w-5/12 h-64 md:h-auto relative">
          {event.image ? (
            <img src={event.image} alt={event.title} className="absolute inset-0 w-full h-full object-cover" />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-800" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent md:bg-gradient-to-r" />
        </div>

        {/* Right Side - Content */}
        <div className="w-full md:w-7/12 p-8 md:p-14 overflow-y-auto text-start">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-6">
            <Info size={14} />
            {t("announcements.eventDetails", { defaultValue: "Announcement Details" })}
          </div>

          <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-8 leading-[1.1] tracking-tight">
            {event.title}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
            <div className="p-5 rounded-3xl bg-gray-50 border border-gray-100">
              <div className="flex items-center gap-3 text-blue-600 mb-2">
                <Calendar size={18} />
                <span className="font-black text-[10px] uppercase tracking-widest">{t("eventsPage.date")}</span>
              </div>
              <p className="font-bold text-gray-800">
                {new Date(event.date).toLocaleDateString(isRTL ? "ar-EG" : "en-US", { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
            <div className="p-5 rounded-3xl bg-gray-50 border border-gray-100">
              <div className="flex items-center gap-3 text-blue-600 mb-2">
                <MapPin size={18} />
                <span className="font-black text-[10px] uppercase tracking-widest">{t("eventsPage.location")}</span>
              </div>
              <p className="font-bold text-gray-800">{event.location}</p>
            </div>
          </div>

          <div className="prose prose-blue max-w-none">
            <h4 className="font-black text-gray-900 text-lg mb-4">{t("eventsPage.description")}</h4>
            <p className="text-gray-600 leading-relaxed text-lg whitespace-pre-wrap font-medium">
              {event.description}
            </p>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Clock size={18} />
              </div>
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter leading-none mb-1">{t("announcements.postedOn", { defaultValue: "Posted On" })}</p>
                <p className="text-sm font-bold text-gray-700">
                   {event.createdAt ? new Date(event.createdAt).toLocaleDateString(isRTL ? "ar-EG" : "en-US") : t("announcements.recently", { defaultValue: "Recently" })}
                </p>
              </div>
            </div>
            <button className="px-8 py-3 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 flex items-center justify-center gap-2">
              <ExternalLink size={18} />
              {t("announcements.registerNow", { defaultValue: "Register Interest" })}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * MAIN ANNOUNCEMENTS PAGE COMPONENT
 */
export default function Announcement() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { events, loading, error } = useAppSelector(selectEventsState);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    dispatch(getEvents({ page: 1, limit: 12 }));
  }, [dispatch]);

  // Derived state
  const sortedEvents = useMemo(() => {
    return [...events].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [events]);

  const featuredEvent = sortedEvents[0];
  const remainingEvents = sortedEvents.slice(1);

  const filteredEvents = useMemo(() => {
    if (!searchTerm) return remainingEvents;
    return remainingEvents.filter(e => 
      e.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      e.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.location.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [remainingEvents, searchTerm]);

  const handleOpenModal = (event: Event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#fafbff] pb-20">
      {/* Search & Breadcrumb Bar */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-40 px-6 py-4 shadow-sm backdrop-blur-md bg-white/80">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="text-start">
            <h2 className="text-xl font-black text-gray-900 tracking-tight">{t("announcements.portal", { defaultValue: "Announcements Portal" })}</h2>
            <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">
              <span>{t("home")}</span>
              <ChevronRight size={10} className="rtl:rotate-180" />
              <span className="text-blue-600">{t("announcements.title", { defaultValue: "Announcements" })}</span>
            </div>
          </div>

          <div className="relative w-full md:w-96 group">
            <div className="absolute inset-y-0 left-4 rtl:left-auto rtl:right-4 flex items-center text-gray-400 group-focus-within:text-blue-500 transition-colors">
              <Search size={18} />
            </div>
            <input 
              type="text" 
              placeholder={t("announcements.searchPlaceholder", { defaultValue: "Search announcements, events, news..." })}
              className="w-full pl-12 pr-6 rtl:pl-6 rtl:pr-12 py-3 bg-gray-50 border border-transparent rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all font-medium text-sm text-start"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-12">
        {/* Error Handling */}
        {error && (
          <div className="bg-red-50 border border-red-100 p-6 rounded-[2rem] text-red-600 flex items-center gap-4 mb-12 animate-in slide-in-from-top-4 duration-500">
            <div className="w-12 h-12 rounded-2xl bg-red-100 flex items-center justify-center shrink-0">
              <X size={24} />
            </div>
            <div>
              <h4 className="font-black text-lg">{t("announcements.errorTitle", { defaultValue: "Unable to load events" })}</h4>
              <p className="font-medium opacity-80">{error}</p>
            </div>
          </div>
        )}

        {/* Featured Section */}
        {!loading && featuredEvent && !searchTerm && (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
            <AnnouncementHero event={featuredEvent} onClick={() => handleOpenModal(featuredEvent)} />
          </div>
        )}

        {/* Latest Announcements Header */}
        <div className="flex items-center justify-between mb-10 mt-16">
          <div className="text-start">
            <h3 className="text-3xl font-black text-gray-900 tracking-tight">
              {searchTerm ? t("announcements.resultsFor", { defaultValue: "Search Results" }) : t("announcements.latest", { defaultValue: "Latest Announcements" })}
            </h3>
            <p className="text-gray-500 font-medium mt-1">
              {searchTerm 
                ? t("announcements.foundCount", { count: filteredEvents.length, defaultValue: `Found ${filteredEvents.length} results matching your search` })
                : t("announcements.subtitle", { defaultValue: "Stay updated with everything happening at Minia University" })}
            </p>
          </div>
          <button className="hidden md:flex items-center gap-2 text-gray-500 font-bold px-5 py-2.5 rounded-xl border border-gray-200 hover:bg-white hover:shadow-sm transition-all">
            <Filter size={18} />
            {t("announcements.filter", { defaultValue: "Filter" })}
          </button>
        </div>

        {/* Announcements Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            Array(6).fill(0).map((_, i) => <SkeletonCard key={i} />)
          ) : filteredEvents.length > 0 ? (
            filteredEvents.map((event, index) => (
              <div 
                key={event._id} 
                className="animate-in fade-in slide-in-from-bottom-8 duration-500" 
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <EventCard event={event} onClick={() => handleOpenModal(event)} />
              </div>
            ))
          ) : (
            <div className="col-span-full py-24 flex flex-col items-center justify-center text-center bg-white rounded-[3rem] border border-dashed border-gray-200">
              <div className="w-24 h-24 rounded-[2rem] bg-gray-50 flex items-center justify-center text-gray-300 mb-6">
                <Info size={48} />
              </div>
              <h4 className="text-2xl font-black text-gray-900 mb-2">{t("announcements.noFound", { defaultValue: "No Announcements Found" })}</h4>
              <p className="text-gray-500 max-w-md font-medium px-6">
                {t("announcements.noFoundDesc", { defaultValue: "We couldn't find any announcements matching your current search or filters. Try adjusting your terms." })}
              </p>
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm("")}
                  className="mt-8 px-8 py-3 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-100"
                >
                  {t("announcements.clearSearch", { defaultValue: "Clear Search" })}
                </button>
              )}
            </div>
          )}
        </div>

        {/* Load More Button */}
        {!loading && filteredEvents.length > 0 && (
          <div className="mt-20 flex justify-center">
            <button className="px-10 py-4 border-2 border-blue-600 text-blue-600 rounded-[2rem] font-black hover:bg-blue-600 hover:text-white transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-xl shadow-blue-900/5">
              {t("announcements.loadMore", { defaultValue: "Load More Announcements" })}
            </button>
          </div>
        )}
      </div>

      {/* Details Modal */}
      <EventDetailsModal 
        event={selectedEvent} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}
