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

export function EventsList() {
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

  // Fetch initial events
  useEffect(() => {
    dispatch(getEvents({ page: 1, limit: 8 }));
  }, [dispatch]);

  // Handle Create
  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(createEvent(formData)).then(() => {
      // Clear form on success
      setFormData({ title: "", description: "", date: "", location: "" });
    });
  };

  // Handle Update Example
  const handleUpdate = (eventId: string) => {
    const newLocation = prompt("Enter new location:");
    if (newLocation) {
      dispatch(updateEvent({ eventId, data: { location: newLocation } }));
    }
  };

  // Handle Delete
  const handleDelete = (eventId: string) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
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
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Events Management
        </h1>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 border border-red-100">
            {error}
          </div>
        )}

        {/* Create Event Form (Admin Only) */}
        {user?.role === "admin" && (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Add New Event
            </h2>
            <form
              onSubmit={handleCreate}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <input
                type="text"
                placeholder="Title"
                required
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Location"
                required
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
              />
              <input
                type="datetime-local"
                required
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Description"
                required
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
              <button
                type="submit"
                disabled={loading}
                className="md:col-span-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50"
              >
                {loading ? "Processing..." : "Create Event"}
              </button>
            </form>
          </div>
        )}

        {/* Events List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            All Events
          </h2>

          {loading && events.length === 0 ? (
            <p className="text-center py-8 text-gray-500">Loading events...</p>
          ) : events.length === 0 ? (
            <p className="text-center py-8 text-gray-500">No events found.</p>
          ) : (
            <div className="space-y-4">
              {events.map((event) => (
                <div
                  key={event._id}
                  className="p-4 border rounded-lg flex flex-col md:flex-row justify-between md:items-center gap-4 hover:bg-gray-50 transition-colors"
                >
                  <div>
                    <h3 className="font-bold text-gray-900">{event.title}</h3>
                    <p className="text-sm text-gray-500">{event.description}</p>
                    <div className="flex gap-3 mt-2 text-xs font-medium text-blue-600 bg-blue-50 w-fit px-3 py-1 rounded-full">
                      <span>📍location : {event.location}</span>
                      <span>
                        📅 {new Date(event.date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Admin Actions */}
                  {user?.role === "admin" && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleUpdate(event._id)}
                        className="px-3 py-1.5 bg-yellow-100 text-yellow-700 rounded-lg text-sm font-medium hover:bg-yellow-200"
                      >
                        Update Location
                      </button>
                      <button
                        onClick={() => handleDelete(event._id)}
                        className="px-3 py-1.5 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          <div className="flex items-center justify-between mt-6 pt-6 border-t">
            <button
              onClick={handlePrevPage}
              disabled={page <= 1 || loading}
              className="px-4 py-2 border rounded-lg font-medium text-gray-600 disabled:opacity-50 hover:bg-gray-50"
            >
              Previous
            </button>
            <span className="text-sm font-medium text-gray-500">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={page >= totalPages || loading}
              className="px-4 py-2 border rounded-lg font-medium text-gray-600 disabled:opacity-50 hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
