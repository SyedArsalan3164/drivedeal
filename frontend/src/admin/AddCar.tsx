import React, { useState } from 'react';
import { Upload, Car, MapPin, DollarSign, Calendar, Settings, Fuel, Gauge, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useData } from '../pages/DataContext';

export const AddCar = () => {
  const navigate = useNavigate();
  const { addCar, uploadImages } = useData();
  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    year: '',
    price: '',
    mileage: '',
    fuelType: 'Petrol',
    transmission: 'Automatic',
    location: '',
    description: '',
    ownerHistory: '1 Previous Owner'
  });
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files) as File[];
      if (imageFiles.length + files.length > 10) {
        toast.error('You can only upload up to 10 images.');
        return;
      }
      setImageFiles((prev) => [...prev, ...files]);
      const newPreviews = files.map((file) => URL.createObjectURL(file));
      setImagePreviews((prev) => [...prev, ...newPreviews]);
    }
  };

  const removeImage = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.brand || !formData.model || !formData.price || imageFiles.length === 0) {
      toast.error('Please fill in all required fields and upload at least one image');
      return;
    }

    setIsSubmitting(true);
    try {
      const loadingToast = toast.loading('Uploading images...');
      const uploadedUrls = await uploadImages(imageFiles);
      toast.dismiss(loadingToast);

      await addCar({
        brand: formData.brand,
        model: formData.model,
        year: parseInt(formData.year) || new Date().getFullYear(),
        price: parseInt(formData.price) || 0,
        mileage: parseInt(formData.mileage) || 0,
        fuelType: formData.fuelType as any,
        transmission: formData.transmission as any,
        location: formData.location,
        description: formData.description,
        ownerHistory: formData.ownerHistory,
        images: uploadedUrls,
        status: 'Available'
      });

      toast.success('Vehicle added successfully!');
      navigate('/admin/manage');
    } catch (error) {
      setIsSubmitting(false);
      // errors handled by context
    }
  };

  return (
    <div className="max-w-4xl mx-auto text-slate-900">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Add New Vehicle</h1>
        <p className="text-slate-500">Enter the details of the new vehicle to add to the collection.</p>
      </div>
      
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-10">
          
         
          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-3 border-b border-slate-100 pb-4">
              <Car className="h-6 w-6 text-blue-600" /> Basic Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Brand *</label>
                <input 
                  type="text" 
                  name="brand"
                  required
                  value={formData.brand}
                  onChange={handleChange}
                  className="w-full bg-white border border-slate-200 rounded-xl py-2.5 px-4 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
                  placeholder="e.g. Porsche"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Model *</label>
                <input 
                  type="text" 
                  name="model"
                  required
                  value={formData.model}
                  onChange={handleChange}
                  className="w-full bg-white border border-slate-200 rounded-xl py-2.5 px-4 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
                  placeholder="e.g. 911 GT3"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Year *</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Calendar className="h-5 w-5 text-slate-400" />
                  </div>
                  <input 
                    type="number" 
                    name="year"
                    required
                    min="1900"
                    max={new Date().getFullYear() + 1}
                    value={formData.year}
                    onChange={handleChange}
                    className="w-full bg-white border border-slate-200 rounded-xl py-2.5 pl-11 pr-4 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
                    placeholder="2024"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Price *</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <DollarSign className="h-5 w-5 text-slate-400" />
                  </div>
                  <input 
                    type="number" 
                    name="price"
                    required
                    min="0"
                    value={formData.price}
                    onChange={handleChange}
                    className="w-full bg-white border border-slate-200 rounded-xl py-2.5 pl-11 pr-4 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
                    placeholder="150000"
                  />
                </div>
              </div>
            </div>
          </div>

          
          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-3 border-b border-slate-100 pb-4">
              <Settings className="h-6 w-6 text-blue-600" /> Specifications
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Mileage (Km/l) *</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Gauge className="h-5 w-5 text-slate-400" />
                  </div>
                  <input 
                    type="number" 
                    name="mileage"
                    required
                    min="0"
                    value={formData.mileage}
                    onChange={handleChange}
                    className="w-full bg-white border border-slate-200 rounded-xl py-2.5 pl-11 pr-4 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
                    placeholder="1200"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Fuel Type</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Fuel className="h-5 w-5 text-slate-400" />
                  </div>
                  <select 
                    name="fuelType"
                    value={formData.fuelType}
                    onChange={handleChange}
                    className="w-full bg-white border border-slate-200 rounded-xl py-2.5 pl-11 pr-4 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm appearance-none"
                  >
                    <option value="Petrol">Petrol</option>
                    <option value="Diesel">Diesel</option>
                    <option value="Electric">Electric</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Transmission</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Settings className="h-5 w-5 text-slate-400" />
                  </div>
                  <select 
                    name="transmission"
                    value={formData.transmission}
                    onChange={handleChange}
                    className="w-full bg-white border border-slate-200 rounded-xl py-2.5 pl-11 pr-4 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm appearance-none"
                  >
                    <option value="Automatic">Automatic</option>
                    <option value="Manual">Manual</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          
          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-3 border-b border-slate-100 pb-4">
              <MapPin className="h-6 w-6 text-blue-600" /> Location & Details
            </h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Location *</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <MapPin className="h-5 w-5 text-slate-400" />
                  </div>
                  <input 
                    type="text" 
                    name="location"
                    required
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full bg-white border border-slate-200 rounded-xl py-2.5 pl-11 pr-4 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
                    placeholder="e.g. Belur, Karnataka"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Vehicle Photos *</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 pt-3 pointer-events-none">
                    <Upload className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full bg-white border border-slate-200 rounded-xl py-2.5 pl-11 pr-4 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                </div>
                <p className="text-xs text-slate-500 mt-2">Upload up to 10 high-quality photos of the vehicle.</p>
                
                {imagePreviews.length > 0 && (
                  <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="relative group rounded-xl overflow-hidden shadow-sm aspect-video">
                        <img src={preview} alt={`Preview ${index}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 p-1.5 bg-white/90 text-red-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-red-50"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                <textarea 
                  name="description"
                  rows={5}
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full bg-white border border-slate-200 rounded-xl py-2.5 px-4 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm resize-none"
                  placeholder="Detailed description of the vehicle's provenance, condition, and features."
                ></textarea>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-100 flex justify-end gap-4">
            <button 
              type="button"
              onClick={() => navigate('/admin/manage')}
              className="px-6 py-2.5 border border-slate-300 rounded-xl text-slate-700 font-medium hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={isSubmitting}
              className={`px-6 py-2.5 bg-blue-600 text-white rounded-xl font-medium shadow-sm transition-colors ${
                isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-700'
              }`}
            >
              {isSubmitting ? 'Adding Vehicle...' : 'Add Vehicle'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
