import React, { useState } from "react";
import { Upload, Sparkles, Flame } from "lucide-react";
import { StarRating } from "./StarRating";

export default function TestimonialsInput() {
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    testimonial: "",
    rating: 0,
  });
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData);
  };
  return (
    <main className="w-full min-h-screen bg-gradient-to-b from-purple-50 to-orange-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Flame className="w-8 h-8 text-orange-400 animate-pulse" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-orange-400 bg-clip-text text-transparent">
              Šarena Čarolija
            </h1>
            <Flame className="w-8 h-8 text-orange-400 animate-pulse" />
          </div>
          <p className="text-purple-600 italic">
            Podijelite svoje iskustvo s nama
          </p>
        </div>
        <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-lg p-8 border border-purple-100 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-400 via-orange-300 to-purple-400"></div>
          <Sparkles className="absolute top-4 right-4 w-6 h-6 text-purple-400 opacity-50" />
          <form onSubmit={handleSubmit} className="space-y-6 relative">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-purple-700 mb-1"
              >
                Vaše Ime
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    name: e.target.value,
                  })
                }
                className="w-full px-4 py-2 border border-purple-200 rounded-md focus:ring-2 focus:ring-purple-400 focus:border-purple-400 bg-white/50"
                required
              />
            </div>
            <div>
              <label
                htmlFor="role"
                className="block text-sm font-medium text-purple-700 mb-1"
              >
                Grad
              </label>
              <input
                type="text"
                id="role"
                value={formData.role}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    role: e.target.value,
                  })
                }
                className="w-full px-4 py-2 border border-purple-200 rounded-md focus:ring-2 focus:ring-purple-400 focus:border-purple-400 bg-white/50"
                required
              />
            </div>
            <div>
              <label
                htmlFor="testimonial"
                className="block text-sm font-medium text-purple-700 mb-1"
              >
                Vaše Iskustvo
              </label>
              <textarea
                id="testimonial"
                value={formData.testimonial}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    testimonial: e.target.value,
                  })
                }
                rows={4}
                className="w-full px-4 py-2 border border-purple-200 rounded-md focus:ring-2 focus:ring-purple-400 focus:border-purple-400 bg-white/50"
                required
                placeholder="Podijelite s nama vaše iskustvo s našim proizvodima..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-purple-700 mb-1">
                Vaša Fotografija (Opcionalno)
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-purple-200 border-dashed rounded-md bg-white/50 hover:bg-white/80 transition-colors duration-200">
                <div className="space-y-1 text-center">
                  <Upload className="mx-auto h-12 w-12 text-purple-400" />
                  <div className="flex text-sm text-purple-600">
                    <label
                      htmlFor="photo"
                      className="relative cursor-pointer rounded-md font-medium text-purple-600 hover:text-purple-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-purple-500"
                    >
                      <span>Učitajte fotografiju</span>
                      <input
                        id="photo"
                        name="photo"
                        type="file"
                        className="sr-only"
                        accept="image/*"
                      />
                    </label>
                  </div>
                  <p className="text-xs text-purple-500">
                    PNG, JPG, GIF do 10MB
                  </p>
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-purple-700 mb-1">
                Ocjena
              </label>
              <StarRating
                rating={formData.rating}
                onRatingChange={(rating) =>
                  setFormData({
                    ...formData,
                    rating,
                  })
                }
              />
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-orange-400 text-white py-3 px-4 rounded-md hover:from-purple-700 hover:to-orange-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transform transition-transform duration-200 hover:scale-[1.02]"
            >
              Pošalji Recenziju
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
