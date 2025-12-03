"use client";
import { useEffect } from "react";
import Image from "next/image";
import { LocationItem } from "../utils/types";

interface ProjectModalProps {
  project: LocationItem;
  onClose: () => void;
}

export default function ProjectModal({ project, onClose }: ProjectModalProps) {
  // Lock body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";

    // Close on Escape key
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);

    return () => {
      document.body.style.overflow = "auto";
      window.removeEventListener("keydown", handleEsc);
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl relative animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-white/80 p-2 rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Close modal"
        >
          ✕
        </button>
        {project.image_url && (
          <div className="w-full h-64 sm:h-80 relative">
            <Image
              src={project.image_url}
              alt={project.name}
              fill
              className="object-cover"
            />
          </div>
        )}
        

        <div className="p-6 sm:p-8 space-y-6">
          <div>
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              {project.category.map((cat, index) => (
                <span
                  key={index}
                  className="bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide"
                >
                  {cat}
                </span>
              ))}
              {project.priority_level === 1 && (
                <span className="bg-red-100 text-red-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                  Featured
                </span>
              )}
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {project.name}
            </h2>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-600">
                <span className="font-semibold">📍 Location:</span>
                <span>{project.place}</span>
              </div>

              {project.phone_number && (
                <div className="flex items-center gap-2 text-gray-600">
                  <span className="font-semibold">📞 Phone:</span>
                  <a
                    href={`tel:${project.phone_number}`}
                    className="text-blue-600 hover:underline"
                  >
                    {project.phone_number}
                  </a>
                </div>
              )}
            </div>
          </div>

          {project.description && (
            <p className="text-gray-600 leading-relaxed text-lg">
              {project.description}
            </p>
          )}

          {project.google_map_location && (
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
              <h4 className="font-semibold text-gray-700 mb-3">
                Project Location
              </h4>
              <div className="w-full h-64 rounded-lg overflow-hidden bg-gray-200 relative">
                <iframe
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  scrolling="no"
                  src={`${project.google_map_location}&output=embed`}
                  className="w-full h-full"
                ></iframe>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
