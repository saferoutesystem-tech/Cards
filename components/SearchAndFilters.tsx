"use client";

import { useState, useEffect } from "react";
import { Search, X, Filter, MapPin, Tag, Percent, Star } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface SearchAndFiltersProps {
  onSearch: (query: string) => void;
  onFilterChange: (filters: FilterState) => void;
  categories: string[];
  cities: string[];
}

export interface FilterState {
  selectedCategories: string[];
  selectedCities: string[];
  discountRange: [number, number];
  priorityLevels: number[];
}

export default function SearchAndFilters({
  onSearch,
  onFilterChange,
  categories,
  cities,
}: SearchAndFiltersProps) {
  const { t, dir } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    selectedCategories: [],
    selectedCities: [],
    discountRange: [0, 100],
    priorityLevels: [],
  });

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    onSearch(value);
  };

  const handleFilterUpdate = (newFilters: Partial<FilterState>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  const toggleCategory = (category: string) => {
    const updated = filters.selectedCategories.includes(category)
      ? filters.selectedCategories.filter((c) => c !== category)
      : [...filters.selectedCategories, category];
    handleFilterUpdate({ selectedCategories: updated });
  };

  const toggleCity = (city: string) => {
    const updated = filters.selectedCities.includes(city)
      ? filters.selectedCities.filter((c) => c !== city)
      : [...filters.selectedCities, city];
    handleFilterUpdate({ selectedCities: updated });
  };

  const togglePriority = (level: number) => {
    const updated = filters.priorityLevels.includes(level)
      ? filters.priorityLevels.filter((p) => p !== level)
      : [...filters.priorityLevels, level];
    handleFilterUpdate({ priorityLevels: updated });
  };

  const clearAllFilters = () => {
    const clearedFilters: FilterState = {
      selectedCategories: [],
      selectedCities: [],
      discountRange: [0, 100],
      priorityLevels: [],
    };
    setFilters(clearedFilters);
    setSearchQuery("");
    onFilterChange(clearedFilters);
    onSearch("");
  };

  const activeFilterCount =
    filters.selectedCategories.length +
    filters.selectedCities.length +
    filters.priorityLevels.length +
    (filters.discountRange[0] > 0 || filters.discountRange[1] < 100 ? 1 : 0);

  return (
    <div className="mb-8 space-y-4" dir={dir}>
      {/* Search Bar */}
      <div className="relative">
        <div className={`absolute inset-y-0 ${dir === "rtl" ? "right-0 pr-3" : "left-0 pl-3"} flex items-center pointer-events-none`}>
          <Search className="w-5 h-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
          placeholder={t("search.placeholder")}
          className={`w-full ${dir === "rtl" ? "pr-10 pl-10" : "pl-10 pr-10"} py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none text-gray-700`}
        />
        {searchQuery && (
          <button
            onClick={() => handleSearchChange("")}
            className={`absolute inset-y-0 ${dir === "rtl" ? "left-0 pl-3" : "right-0 pr-3"} flex items-center text-gray-400 hover:text-gray-600`}
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Filter Toggle Button */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-gray-200 rounded-lg hover:border-[#1b447a] transition-colors"
        >
          <Filter className="w-5 h-5 text-[#1b447a]" />
          <span className="font-medium text-gray-700">{t("filters")}</span>
          {activeFilterCount > 0 && (
            <span className="bg-[#1b447a] text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </button>

        {activeFilterCount > 0 && (
          <button
            onClick={clearAllFilters}
            className="flex items-center gap-2 px-4 py-2 text-red-600 hover:text-red-700 font-medium"
          >
            <X className="w-4 h-4" />
            {t("clear.all")}
          </button>
        )}
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-white rounded-xl border-2 border-gray-200 p-6 space-y-6">
          {/* Cities Filter */}
          {cities.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="w-5 h-5 text-[#1b447a]" />
                <h3 className="font-semibold text-gray-800">{t("filter.cities")}</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {cities.map((city) => (
                  <button
                    key={city}
                    onClick={() => toggleCity(city)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      filters.selectedCities.includes(city)
                        ? "bg-[#1b447a] text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {city}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Categories Filter */}
          {categories.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Tag className="w-5 h-5 text-[#1b447a]" />
                <h3 className="font-semibold text-gray-800">{t("filter.categories")}</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => toggleCategory(category)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      filters.selectedCategories.includes(category)
                        ? "bg-[#1b447a] text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Discount Range Filter */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Percent className="w-5 h-5 text-[#1b447a]" />
              <h3 className="font-semibold text-gray-800">{t("filter.discount")}</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={filters.discountRange[0]}
                  onChange={(e) =>
                    handleFilterUpdate({
                      discountRange: [
                        parseInt(e.target.value),
                        filters.discountRange[1],
                      ],
                    })
                  }
                  className="flex-1"
                />
                <span className="text-sm font-medium text-gray-700 min-w-[60px]">
                  {filters.discountRange[0]}% - {filters.discountRange[1]}%
                </span>
              </div>
            </div>
          </div>

          {/* Priority Filter */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Star className="w-5 h-5 text-[#1b447a]" />
              <h3 className="font-semibold text-gray-800">{t("filter.priority")}</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {[1, 2, 3].map((level) => (
                <button
                  key={level}
                  onClick={() => togglePriority(level)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    filters.priorityLevels.includes(level)
                      ? "bg-[#1b447a] text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {level === 1 ? t("priority.featured") : `${t("priority.level")} ${level}`}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}