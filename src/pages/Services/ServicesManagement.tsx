import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks/hook";
import {
  getAllServices,
  createService,
  updateService,
  deleteService,
} from "../../store/AsyncThunks/servicesThunks";
import {
  selectAllServices,
  selectServicesLoading,
  selectServicesError,
  clearError,
} from "../../store/slices/servicesslice";
import type { Service } from "../../store/types/servicesType";
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  X, 
  Upload,
  AlertCircle,
  Loader2,
  Filter
} from "lucide-react";
import { toast } from "sonner";

export function ServicesManagement() {
  const dispatch = useAppDispatch();
  const services = useAppSelector(selectAllServices);
  const loading = useAppSelector(selectServicesLoading);
  const error = useAppSelector(selectServicesError);

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
console.log(services)
  // Form State
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "education",
    price: 0,
    priority: "low",
    requiredDocuments: [] as string[],
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [docInput, setDocInput] = useState("");

  useEffect(() => {
    dispatch(getAllServices());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const filteredServices = services.filter((svc) => {
    const matchesSearch = svc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         svc.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || svc.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleOpenAddModal = () => {
    setEditingService(null);
    setFormData({
      name: "",
      description: "",
      category: "education",
      price: 0,
      priority: "low",
      requiredDocuments: [],
    });
    setImageFile(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (service: Service) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      description: service.description,
      category: service.category,
      price: service.price,
      priority: service.priority,
      requiredDocuments: service.requiredDocuments || [],
    });
    setImageFile(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingService(null);
  };

  const handleAddDoc = () => {
    if (docInput.trim()) {
      setFormData(prev => ({
        ...prev,
        requiredDocuments: [...prev.requiredDocuments, docInput.trim()]
      }));
      setDocInput("");
    }
  };

  const handleRemoveDoc = (index: number) => {
    setFormData(prev => ({
      ...prev,
      requiredDocuments: prev.requiredDocuments.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const data = new FormData();
    data.append("name", formData.name);
    data.append("description", formData.description);
    data.append("category", formData.category);
    data.append("price", formData.price.toString());
    data.append("priority", formData.priority);
    formData.requiredDocuments.forEach(doc => {
      data.append("requiredDocuments", doc);
    });
    
    if (imageFile) {
      data.append("image", imageFile);
    }

    try {
      if (editingService) {
        await dispatch(updateService({ id: editingService._id, data })).unwrap();
        toast.success("Service updated successfully");
      } else {
        await dispatch(createService(data)).unwrap();
        toast.success("Service created successfully");
      }
      handleCloseModal();
    } catch (err) {
      // Error handled by useEffect and toast
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await dispatch(deleteService(id)).unwrap();
      toast.success("Service deleted successfully");
      setConfirmDelete(null);
    } catch (err) {
      // Error handled by useEffect and toast
    }
  };

  return (
    <div className="p-6 bg-[#f8fafc] min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#1e293b] tracking-tight">Services Management</h1>
            <p className="text-slate-500 mt-1">Manage and organize platform services efficiently</p>
          </div>
          <button
            onClick={handleOpenAddModal}
            className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl transition-all shadow-md shadow-indigo-100 font-semibold"
          >
            <Plus size={20} />
            Add New Service
          </button>
        </div>

        {/* Filters Section */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 mb-6 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search services by name or description..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-slate-500 font-medium whitespace-nowrap">
              <Filter size={18} />
              Filter by:
            </div>
            <select
              className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-slate-700 font-medium"
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

        {/* Services Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-bottom border-slate-100">
                  <th className="px-6 py-4 text-sm font-semibold text-slate-600">Image</th>
                  <th className="px-6 py-4 text-sm font-semibold text-slate-600">Service Name</th>
                  <th className="px-6 py-4 text-sm font-semibold text-slate-600">Category</th>
                  <th className="px-6 py-4 text-sm font-semibold text-slate-600">Price</th>
                  <th className="px-6 py-4 text-sm font-semibold text-slate-600">Priority</th>
                  <th className="px-6 py-4 text-sm font-semibold text-slate-600 text-center">Docs</th>
                  <th className="px-6 py-4 text-sm font-semibold text-slate-600 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading && (!services || services.length === 0) ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <Loader2 className="animate-spin text-indigo-500" size={40} />
                        <p className="text-slate-500 font-medium">Loading services...</p>
                      </div>
                    </td>
                  </tr>
                ) : error && (!services || services.length === 0) ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center text-red-500">
                          <AlertCircle size={32} />
                        </div>
                        <p className="text-red-600 font-medium text-lg">Failed to load services</p>
                        <p className="text-slate-500">{error}</p>
                        <button 
                          onClick={() => dispatch(getAllServices())}
                          className="mt-2 text-indigo-600 font-semibold hover:text-indigo-700 underline"
                        >
                          Try again
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (!services || services.length === 0) ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
                          <AlertCircle size={32} />
                        </div>
                        <p className="text-slate-500 font-medium text-lg">No services available</p>
                        <p className="text-slate-400">Click the button above to add your first service</p>
                      </div>
                    </td>
                  </tr>
                ) : (filteredServices && filteredServices.length === 0) ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
                          <Search size={32} />
                        </div>
                        <p className="text-slate-500 font-medium text-lg">No matching results</p>
                        <p className="text-slate-400">Try adjusting your filters or search terms</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredServices?.map((service) => (
                    <tr key={service._id} className="hover:bg-slate-50 transition-colors group">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden border border-slate-200">
                          {service.image ? (
                            <img 
                              src={service.image} 
                              alt={service.name} 
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = "https://placehold.co/100x100?text=No+Img";
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-400">
                              <Upload size={18} />
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-[#1e293b]">{service.name}</div>
                        <div className="text-xs text-slate-400 truncate max-w-[200px]">{service.description}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                          service.category === 'education' ? 'bg-blue-50 text-blue-600' :
                          service.category === 'visa' ? 'bg-purple-50 text-purple-600' :
                          service.category === 'housing' ? 'bg-amber-50 text-amber-600' :
                          'bg-emerald-50 text-emerald-600'
                        }`}>
                          {service.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap font-semibold text-slate-700">
                        ${service.price.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded-lg text-xs font-bold border ${
                          service.priority === 'high' ? 'bg-rose-50 border-rose-100 text-rose-600' :
                          service.priority === 'medium' ? 'bg-orange-50 border-orange-100 text-orange-600' :
                          'bg-slate-50 border-slate-100 text-slate-500'
                        }`}>
                          {service.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded-lg text-xs font-bold">
                          {service.requiredDocuments?.length || 0} docs
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleOpenEditModal(service)}
                            className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                            title="Edit Service"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={() => setConfirmDelete(service._id)}
                            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                            title="Delete Service"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={handleCloseModal} />
          <div className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-y-hidden max-h-[95vh] animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between px-8 py-5 border-b border-slate-100">
              <div>
                <h2 className="text-2xl font-bold text-[#1e293b]">
                  {editingService ? "Edit Service" : "Add New Service"}
                </h2>
                <p className="text-slate-400 text-sm">Enter the details of the service below</p>
              </div>
              <button onClick={handleCloseModal} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="px-8 py-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Name */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-slate-700 mb-2">Service Name</label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-1.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="e.g. Premium Visa Consultation"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-slate-700 mb-2">Description</label>
                  <textarea
                    required
                    rows={3}
                    className="w-full px-4 py-1.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                    placeholder="Describe the service in detail..."
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Category</label>
                  <select
                    className="w-full px-4 py-1.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value as any})}
                  >
                    <option value="education">Education</option>
                    <option value="visa">Visa</option>
                    <option value="housing">Housing</option>
                    <option value="financial">Financial</option>
                  </select>
                </div>

                {/* Price */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Price ($)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    className="w-full px-4 py-1.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}
                  />
                </div>

                {/* Priority */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Priority</label>
                  <select
                    className="w-full px-4 py-1.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={formData.priority}
                    onChange={(e) => setFormData({...formData, priority: e.target.value as any})}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Service Image</label>
                  <div className="relative group">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      id="image-upload"
                      onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                    />
                    <label
                      htmlFor="image-upload"
                      className="flex items-center justify-between w-full px-4 py-1.5 bg-slate-50 border border-slate-200 border-dashed rounded-xl cursor-pointer hover:bg-slate-100 transition-colors"
                    >
                      <span className="text-sm text-slate-500 truncate">
                        {imageFile ? imageFile.name : "Select an image"}
                      </span>
                      <Upload size={18} className="text-slate-400" />
                    </label>
                  </div>
                </div>

                {/* Required Documents */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-slate-700 mb-2">Required Documents</label>
                  <div className="flex gap-2 mb-1.5">
                    <input
                      type="text"
                      className="flex-1 px-4 py-1.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g. Passport Copy"
                      value={docInput}
                      onChange={(e) => setDocInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddDoc())}
                    />
                    <button
                      type="button"
                      onClick={handleAddDoc}
                      className="bg-indigo-50 text-indigo-600 px-4 py-1 rounded-xl font-bold hover:bg-indigo-100 transition-colors"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.requiredDocuments.map((doc, index) => (
                      <span key={index} className="flex items-center gap-2 bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg text-sm font-medium">
                        {doc}
                        <button type="button" onClick={() => handleRemoveDoc(index)} className="text-slate-400 hover:text-rose-500 transition-colors">
                          <X size={14} />
                        </button>
                      </span>
                    ))}
                    {formData.requiredDocuments.length === 0 && (
                      <p className="text-slate-400 text-xs italic">No documents added yet</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="my-6 flex gap-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 px-6 py-2 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-3 px-6 py-2 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading && <Loader2 className="animate-spin" size={18} />}
                  {editingService ? "Save Changes" : "Create Service"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setConfirmDelete(null)} />
          <div className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl p-8 animate-in fade-in zoom-in duration-200">
            <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center mb-6 mx-auto">
              <Trash2 size={32} />
            </div>
            <h3 className="text-2xl font-bold text-center text-[#1e293b] mb-2">Delete Service?</h3>
            <p className="text-slate-500 text-center mb-8">
              This action cannot be undone. All data associated with this service will be permanently removed.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setConfirmDelete(null)}
                className="flex-1 px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(confirmDelete)}
                disabled={loading}
                className="flex-1 px-6 py-3 bg-rose-500 text-white rounded-xl font-bold hover:bg-rose-600 transition-all shadow-lg shadow-rose-100 flex items-center justify-center gap-2"
              >
                {loading && <Loader2 className="animate-spin" size={18} />}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
