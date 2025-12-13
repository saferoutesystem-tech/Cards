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
  const [filteredProjects, setFilteredProjects] = useState<LocationItem[]>([]);
  const [visibleCount, setVisibleCount] = useState(9);
  const [selectedProject, setSelectedProject] = useState<LocationItem | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const observerTarget = useRef<HTMLDivElement>(null);
  const [selectedCities, setSelectedCities] = useState<string[]>([]);

  // Fetch projects on language change
  useEffect(() => {
    async function fetchProjects() {
      try {
        setLoading(true);
        const supabase = createMultiLangClient(language);
        const { data, error } = await supabase
          .from("projects")
          .select(
            "id, name, place, google_map_location, phone_number, category, priority_level, image_url, description, city"
          )
          .order("priority_level", { ascending: true })
          .order("created_at", { ascending: false });

        if (error) throw error;

        setProjects(data || []);
        setFilteredProjects(data || []);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch projects"
        );
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, [language]);

  // Apply filtering
  useEffect(() => {
    if (selectedCities.length === 0) {
      setFilteredProjects(projects);
      setVisibleCount(9);
      return;
    }

    const filtered = projects.filter(
      (p) => p.city && selectedCities.includes(p.city)
    );
    setFilteredProjects(filtered);
    setVisibleCount(9);
  }, [selectedCities, projects]);

  const toggleCity = (city: string) => {
    setSelectedCities((prev) =>
      prev.includes(city) ? prev.filter((c) => c !== city) : [...prev, city]
    );
  };

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
          setVisibleCount((prev) =>
            Math.min(prev + 6, filteredProjects.length)
          );
        }
      },
      { threshold: 0.1, rootMargin: "100px" }
    );

    if (observerTarget.current) observer.observe(observerTarget.current);
    return () => observer.disconnect();
  }, [filteredProjects.length]);

  // Loading state
  if (loading) {
    return (
      <section className="min-h-screen bg-gray-50 py-16 px-4" dir={dir}>
        <div className="max-w-7xl mx-auto flex justify-center items-center h-96">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="ml-4 text-gray-600">{t("loading")}</p>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section className="min-h-screen bg-gray-50 py-16 px-4" dir={dir}>
        <div className="max-w-7xl mx-auto bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <h2 className="text-xl font-semibold text-red-800 mb-2">
            {t("error.loading")}
          </h2>
          <p className="text-red-600">{error}</p>
        </div>
      </section>
    );
  }

  // Empty state
  if (projects.length === 0) {
    return (
      <section className="min-h-screen bg-gray-50 py-16 px-4" dir={dir}>
        <div className="max-w-7xl mx-auto text-center py-12">
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">
            {t("no.projects")}
          </h2>
          <p className="text-gray-500">{t("check.back")}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-gray-50 pb-16 px-4" dir={dir}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <Image
            src={"/logoAndSlogan.png"}
            width={200}
            height={100}
            // className={dir === "rtl" ? "mr-auto" : ""}
            alt="Cardly"
            loading="lazy"
          />
          <LanguageSwitcher />
        </div>
         {/* City Filters */}
        <div className="flex gap-6 mb-6 justify-center">
          <label className="flex items-center gap-2 px-4 py-2 bg-[#f8f8f8] rounded-xl shadow hover:shadow-md transition">
            <input
              type="checkbox"
              className="h-5 w-5 accent-[#1b447a]"
              checked={selectedCities.includes("Sulaimanyah")}
              onChange={() => toggleCity("Sulaimanyah")}
            />
            <span className="text-[#1b447a] font-medium">Sulaimanyah</span>
          </label>

          <label className="flex items-center gap-2 px-4 py-2 bg-[#f8f8f8] rounded-xl shadow hover:shadow-md transition">
            <input
              type="checkbox"
              className="h-5 w-5 accent-[#1b447a]"
              checked={selectedCities.includes("Hawler")}
              onChange={() => toggleCity("Hawler")}
            />
            <span className="text-[#1b447a] font-medium">Hawler</span>
          </label>
        </div>
        {/* Title */}
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          {/* {t("featured.projects")} */}
        </h1>
        {/* Cards */}
        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.slice(0, visibleCount).map((item) => (
            <ProjectCard key={item.id} item={item} onClick={handleCardClick} />
          ))}
        </div>
        {visibleCount < filteredProjects.length && (
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
