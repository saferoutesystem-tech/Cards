"use client";
import { useState, useCallback, useRef, useEffect } from "react";
// import { supabase } from "../lib/supabase";
import { createClient } from "@/lib/supabase/client";
import { LocationItem } from "../utils/types";
import ProjectCard from "./ProjectCard";
import ProjectModal from "./ProjectModal";

export default function FeaturedProjects() {
  const supabase = createClient();
  const [projects, setProjects] = useState<LocationItem[]>([]);
  const [visibleCount, setVisibleCount] = useState(9);
  const [selectedProject, setSelectedProject] = useState<LocationItem | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const observerTarget = useRef<HTMLDivElement>(null);

  // Fetch projects from Supabase
  useEffect(() => {
    async function fetchProjects() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("projects")
          .select(
            "id, name, place, google_map_location, phone_number, category, priority_level, image_url, description"
          )
          .order("priority_level", { ascending: true }) // Lower priority_level = higher priority
          .order("created_at", { ascending: false });

        if (error) throw error;

        // Data already matches LocationItem interface
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
  }, []);

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
      <section className="min-h-screen bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center items-center h-96">
            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section className="min-h-screen bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <h2 className="text-xl font-semibold text-red-800 mb-2">
              Error Loading Projects
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
      <section className="min-h-screen bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">
              No Projects Found
            </h2>
            <p className="text-gray-500">Check back later for new projects.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center mb-12 text-gray-900">
          Featured Projects
        </h1>

        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {projects.slice(0, visibleCount).map((item) => (
            <ProjectCard key={item.id} item={item} onClick={handleCardClick} />
          ))}
        </div>

        {/* Loading Spinner for infinite scroll */}
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
