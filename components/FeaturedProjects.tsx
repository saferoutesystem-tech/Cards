// components/FeaturedProjects.tsx
"use client";
import { useState, useCallback, useRef, useEffect } from "react";
import { createMultiLangClient } from "@/lib/supabase/multiLangClient";
import { useLanguage } from "@/contexts/LanguageContext";
import { LocationItem } from "../utils/types";
import ProjectCard from "./ProjectCard";
import ProjectModal from "./ProjectModal";
import LanguageSwitcher from "./LanguageSwitcher";
import Image from "next/image";

export default function FeaturedProjects() {
  const { language, t, dir } = useLanguage();
  const [projects, setProjects] = useState<LocationItem[]>([]);
  const [visibleCount, setVisibleCount] = useState(9);
  const [selectedProject, setSelectedProject] = useState<LocationItem | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const observerTarget = useRef<HTMLDivElement>(null);

  // Fetch projects when language changes
  useEffect(() => {
    async function fetchProjects() {
      try {
        setLoading(true);
        const supabase = createMultiLangClient(language);
        const { data, error } = await supabase
          .from("projects")
          .select(
            "id, name, place, google_map_location, phone_number, category, priority_level, image_url, description"
          )
          .order("priority_level", { ascending: true })
          .order("created_at", { ascending: false });

        if (error) throw error;

        setProjects(data || []);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch projects"
        );
        console.error("Error fetching projects:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, [language]);

  const handleCardClick = useCallback((item: LocationItem) => {
    setSelectedProject(item);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedProject(null);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount((prev) => Math.min(prev + 6, projects.length));
        }
      },
      { threshold: 0.1, rootMargin: "100px" }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [projects.length]);

  // Loading state
  if (loading) {
    return (
      <section
        className="min-h-screen bg-gray-50 py-16 px-4 sm:px-6 lg:px-8"
        // dir={dir}
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center items-center h-96">
            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            {/* <p className="ml-4 text-gray-600">{t("loading")}</p> */}
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section
        className="min-h-screen bg-gray-50 py-16 px-4 sm:px-6 lg:px-8"
        dir={dir}
      >
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <h2 className="text-xl font-semibold text-red-800 mb-2">
              {t("error.loading")}
            </h2>
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </section>
    );
  }

  // Empty state
  if (projects.length === 0) {
    return (
      <section
        className="min-h-screen bg-gray-50 py-16 px-4 sm:px-6 lg:px-8"
        dir={dir}
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">
              {t("no.projects")}
            </h2>
            <p className="text-gray-500">{t("check.back")}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className="min-h-screen bg-gray-50 pb-16 px-4 sm:px-6 lg:px-8"
      dir={dir}
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <Image
            src={"/logoAndSlogan.png"}
            width={200}
            height={100}
            alt="Cardly"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            loading="lazy"
          />
          <LanguageSwitcher />
        </div>

        {/* <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          {t("featured.projects")}
        </h1> */}

        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {projects.slice(0, visibleCount).map((item) => (
            <ProjectCard key={item.id} item={item} onClick={handleCardClick} />
          ))}
        </div>

        {visibleCount < projects.length && (
          <div
            ref={observerTarget}
            className="h-20 flex justify-center items-center mt-10"
          >
            <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          </div>
        )}

        {selectedProject && (
          <ProjectModal project={selectedProject} onClose={handleCloseModal} />
        )}
      </div>
    </section>
  );
}
