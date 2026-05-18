import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks/hook";
import {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  selectEventsState,
} from "../../store/slices/eventsSlice";
import { selectUser } from "../../store/slices/authSlice";
import { useTranslation } from "react-i18next";
import { Plus, Edit2, Trash2, X, Upload, Calendar, MapPin, Loader2 } from "lucide-react";
import { toast } from "sonner";
import type { Event } from "../../store/slices/eventsSlice";

export function EventsList() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { events, loading, error, page, totalPages } =
    useAppSelector(selectEventsState);
  const user = useAppSelector(selectUser);

  // Simple state for Create Event form
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);

  // Fetch initial events
  useEffect(() => {
    dispatch(getEvents({ page: 1, limit: 8 }));
  }, [dispatch]);

  // Handle Image Change
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error(t("eventsPage.invalidImage"));
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleOpenAddModal = () => {
    setEditingEvent(null);
    setFormData({ title: "", description: "", date: "", location: "" });
    setImageFile(null);
    setImagePreview(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (event: Event) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      description: event.description,
      date: event.date ? new Date(event.date).toISOString().slice(0, 16) : "",
      location: event.location,
    });
    setImageFile(null);
    setImagePreview(event.image || null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingEvent(null);
    setImageFile(null);
    setImagePreview(null);
  };

  // Handle Submit (Create or Update)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("date", formData.date);
    data.append("location", formData.location);
    if (imageFile) {
      data.append("image", imageFile);
    }

    // Debug: Log FormData content (Check browser console)
    console.log("--- Sending Event FormData ---");
    data.forEach((value, key) => {
      console.log(`${key}:`, value);
    });

    try {
      if (editingEvent) {
        await dispatch(updateEvent({ eventId: editingEvent._id, data })).unwrap();
        toast.success(t("eventsPage.updateSuccess", { defaultValue: "Event updated successfully" }));
      } else {
        await dispatch(createEvent(data)).unwrap();
        toast.success(t("eventsPage.createSuccess", { defaultValue: "Event created successfully" }));
      }
      handleCloseModal();
    } catch (err) {
      // Error handled by redux state
    }
  };

  // Handle Delete
  const handleDelete = (eventId: string) => {
    if (window.confirm(t("eventsPage.deleteConfirm"))) {
      dispatch(deleteEvent(eventId));
    }
  };

  // Handle Pagination
  const handleNextPage = () => {
    if (page < totalPages) {
      dispatch(getEvents({ page: page + 1, limit: 8 }));
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      dispatch(getEvents({ page: page - 1, limit: 8 }));
    }
  };

  return (
    <>
      <div className="p-6 bg-original-background-alt min-h-screen">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div className="text-start">
              <h1 className="text-3xl font-bold text-original-text tracking-tight">
                {t("eventsPage.title")}
              </h1>
              <p className="text-original-text-muted mt-1">{t("eventsPage.subtitle", { defaultValue: "Discover and manage upcoming university events" })}</p>
            </div>
            {user?.role === "admin" && (
              <button
                onClick={handleOpenAddModal}
                className="flex items-center justify-center gap-2 bg-original-primary text-white hover:bg-original-primary-hover text-white px-5 py-2.5 rounded-xl transition-all shadow-md dark:shadow-black/20 font-semibold"
              >
                <Plus size={20} />
                {t("eventsPage.addNewEvent")}
              </button>
            )}
          </div>

          {/* Error Alert */}
          {error && (
            <div className="bg-original-danger-light text-original-danger p-4 rounded-xl mb-6 border border-original-danger-light flex items-center gap-3">
              <X size={18} />
              {error}
            </div>
          )}

          {/* Events List */}
          <div className="bg-original-card rounded-2xl shadow-sm border border-original-border-light p-6 overflow-hidden">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-original-text">
                {t("eventsPage.allEvents")}
              </h2>
            </div>

            {loading && events.length === 0 ? (
              <p className="text-center py-8 text-original-text-muted">{t("eventsPage.loadingEvents")}</p>
            ) : events.length === 0 ? (
              <p className="text-center py-8 text-original-text-muted">{t("eventsPage.noEvents")}</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {events.map((event) => (
                  <div
                    key={event._id}
                    className="group bg-original-card border border-original-border-light rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-md dark:shadow-black/40 transition-all duration-300"
                  >
                    {/* Event Image */}
                    <div className="relative h-48 bg-original-background-alt overflow-hidden">
                      {event.image ? (
                        <img 
                          src={event.image} 
                          alt={event.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-original-text-muted/70 gap-2">
                          <Calendar size={40} className="opacity-20" />
                          <span className="text-xs font-medium uppercase tracking-wider">{t("eventsPage.noImage")}</span>
                        </div>
                      )}
                      
                      {/* Admin Actions Overlay */}
                      {user?.role === "admin" && (
                        <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleOpenEditModal(event)}
                            className="p-2 bg-original-card/90 backdrop-blur text-original-primary rounded-xl shadow-sm hover:bg-original-card transition-colors"
                            title={t("eventsPage.edit")}
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(event._id)}
                            className="p-2 bg-original-card/90 backdrop-blur text-original-danger rounded-xl shadow-sm hover:bg-original-card transition-colors"
                            title={t("eventsPage.delete")}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Event Details */}
                    <div className="p-5 text-start">
                      <h3 className="font-bold text-original-text-dark text-lg mb-2 line-clamp-1">{event.title}</h3>
                      <p className="text-sm text-original-text-muted mb-4 line-clamp-2 h-10">{event.description}</p>
                      
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-xs font-semibold text-original-text-muted">
                          <div className="w-6 h-6 rounded-lg bg-original-background-alt text-original-primary text-original-primary flex items-center justify-center">
                            <MapPin size={14} />
                          </div>
                          {event.location}
                        </div>
                        <div className="flex items-center gap-2 text-xs font-semibold text-original-text-muted">
                          <div className="w-6 h-6 rounded-lg bg-original-background-alt text-original-primary flex items-center justify-center">
                            <Calendar size={14} />
                          </div>
                          {new Date(event.date).toLocaleDateString(document.documentElement.lang === "ar" ? "ar-EG" : "en-US", {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination Controls */}
            <div className="flex items-center justify-between mt-6 pt-6 border-t">
              <button
                onClick={handlePrevPage}
                disabled={page <= 1 || loading}
                className="px-4 py-2 border rounded-lg font-medium text-original-text-muted disabled:opacity-50 hover:bg-original-background-alt"
              >
                {t("eventsPage.previous")}
              </button>
              <span className="text-sm font-medium text-original-text-muted">
                {t("eventsPage.pageOf", { page, totalPages })}
              </span>
              <button
                onClick={handleNextPage}
                disabled={page >= totalPages || loading}
                className="px-4 py-2 border rounded-lg font-medium text-original-text-muted disabled:opacity-50 hover:bg-original-background-alt"
              >
                {t("eventsPage.next")}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-original-text-dark/40 backdrop-blur-sm" onClick={handleCloseModal} />
          <div className="relative bg-original-card w-full max-w-2xl rounded-3xl shadow-2xl overflow-y-hidden max-h-[95vh] animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between px-8 py-5 border-b border-original-border-light">
              <div className="text-start">
                <h2 className="text-2xl font-bold text-original-text-dark">
                  {editingEvent ? t("eventsPage.editEvent") : t("eventsPage.addNewEvent")}
                </h2>
                <p className="text-original-text-muted/70 text-sm">{t("eventsPage.modalSubtitle", { defaultValue: "Enter the details of the event below" })}</p>
              </div>
              <button onClick={handleCloseModal} className="p-2 hover:bg-original-background-alt rounded-full text-original-text-muted/70 transition-colors">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="px-8 py-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Title */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-original-text mb-2 text-start">{t("eventsPage.eventTitle")}</label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-2.5 bg-original-background-alt border border-original-border rounded-xl focus:outline-none focus:ring-2 focus:ring-original-primary text-start"
                    placeholder={t("eventsPage.eventTitlePlaceholder")}
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                  />
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-original-text mb-2 text-start">{t("eventsPage.description")}</label>
                  <textarea
                    required
                    rows={3}
                    className="w-full px-4 py-2.5 bg-original-background-alt border border-original-border rounded-xl focus:outline-none focus:ring-2 focus:ring-original-primary resize-none text-start"
                    placeholder={t("eventsPage.descriptionPlaceholder")}
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                  />
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-bold text-original-text mb-2 text-start">{t("eventsPage.location")}</label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-2.5 bg-original-background-alt border border-original-border rounded-xl focus:outline-none focus:ring-2 focus:ring-original-primary text-start"
                    placeholder={t("eventsPage.locationPlaceholder")}
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                  />
                </div>

                {/* Date */}
                <div>
                  <label className="block text-sm font-bold text-original-text mb-2 text-start">{t("eventsPage.date")}</label>
                  <input
                    type="datetime-local"
                    required
                    className="w-full px-4 py-2.5 bg-original-background-alt border border-original-border rounded-xl focus:outline-none focus:ring-2 focus:ring-original-primary"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                  />
                </div>

                {/* Image Upload */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-original-text mb-2 text-start">{t("eventsPage.eventImage")}</label>
                  <div className="flex flex-col md:flex-row gap-4 items-start">
                    {/* Preview */}
                    <div className="w-full md:w-48 h-32 rounded-2xl bg-original-background-alt border-2 border-dashed border-original-border overflow-hidden flex items-center justify-center relative group">
                      {imagePreview ? (
                        <>
                          <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                          <button 
                            type="button"
                            onClick={() => { setImageFile(null); setImagePreview(null); }}
                            className="absolute top-2 right-2 p-1.5 bg-original-danger text-white text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X size={14} />
                          </button>
                        </>
                      ) : (
                        <Calendar size={32} className="text-original-text-muted" />
                      )}
                    </div>
                    
                    {/* Input */}
                    <div className="flex-1 w-full">
                      <label className="flex flex-col items-center justify-center w-full h-32 bg-original-background-alt border-2 border-dashed border-original-border rounded-2xl cursor-pointer hover:bg-original-background-alt transition-colors">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload size={24} className="text-original-text-muted/70 mb-2" />
                          <p className="text-sm text-original-text-muted font-medium">{t("eventsPage.uploadInstructions")}</p>
                          <p className="text-xs text-original-text-muted/70 mt-1">PNG, JPG, WEBP (Max 5MB)</p>
                        </div>
                        <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex gap-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 px-6 py-3 bg-original-background-alt text-original-text rounded-xl font-bold hover:bg-original-background-alt transition-colors"
                >
                  {t("dashboardPage.cancel")}
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-3 px-6 py-3 bg-original-primary text-white text-white rounded-xl font-bold hover:bg-original-primary-hover transition-all shadow-lg dark:shadow-black/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading && <Loader2 className="animate-spin" size={18} />}
                  {editingEvent ? t("eventsPage.saveChanges") : t("eventsPage.createEvent")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
