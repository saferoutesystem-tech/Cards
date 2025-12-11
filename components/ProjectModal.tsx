// components/ProjectModal.tsx
"use client";
import { useEffect } from "react";
import Image from "next/image";
import { LocationItem } from "../utils/types";
import { useLanguage } from "@/contexts/LanguageContext";

interface ProjectModalProps {
  project: LocationItem;
  onClose: () => void;
}

export default function ProjectModal({ project, onClose }: ProjectModalProps) {
  const { t, dir } = useLanguage();

  useEffect(() => {
    document.body.style.overflow = "hidden";

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
      dir={dir}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl relative scrollbar-hide"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className={`absolute top-4 ${
            dir === "rtl" ? "left-4" : "right-4"
          } z-10 bg-white/80 p-2 rounded-full hover:bg-gray-100 transition-colors w-10 h-10 flex items-center justify-center text-[#1b447a] hover:text-gray-800`}
          aria-label="Close modal"
        >
          ✕
        </button>

        {project.image_url && (
          <div className="w-full h-64 sm:h-80 relative overflow-hidden rounded-t-2xl">
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
                  className="rounded-full bg-white/92 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-sky-700 shadow-sm ring-1 ring-sky-100"
                >
                  {cat}
                </span>
              ))}
              {project.priority_level === 1 && (
                <span className="inline-flex items-center gap-1 rounded-full bg-[#1b447a] px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white shadow-md shadow-[#1b447a]/40">
                  <span className="h-1.5 w-1.5 rounded-full bg-white shadow-[0_0_0_3px_rgba(250,250,249,0.4)]" />
                  {t("featured")}
                </span>
              )}
            </div>
            <h2 className="text-3xl font-bold text-[#1b447a] mt-4 mb-2">
              {project.name}
            </h2>

            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-gray-600">
                <span className="font-semibold">📍 {t("location")}:</span>
                <span>{project.place}</span>
              </div>

              {project.phone_number && (
                <div className="flex items-center gap-2 text-gray-600">
                  <span className="font-semibold">📞 {t("phone")}: </span>
                  <a
                    href={`tel:${project.phone_number}`}
                    className="text-blue-600 hover:underline ltr-only"
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
                {t("project.location")}
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
