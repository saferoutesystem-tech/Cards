import { memo } from "react";
import Image from "next/image";
import { LocationItem } from "../utils/types";

interface ProjectCardProps {
  item: LocationItem;
  onClick: (item: LocationItem) => void;
}

const ProjectCard = memo(function ProjectCard({
  item,
  onClick,
}: ProjectCardProps) {
  return (
    <article
      className="group bg-white rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 overflow-hidden cursor-pointer transition-all duration-300 transform-gpu"
      onClick={() => onClick(item)}
    >
      <div className="relative h-56 w-full bg-gray-200">
        {item.image_url && (
          <Image
            src={item.image_url}
            alt={item.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            loading="lazy"
            placeholder="empty"
          />
        )}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1">
          {item.category.slice(0, 2).map((cat, index) => (
            <span
              key={index}
              className="bg-white/90 backdrop-blur-sm text-blue-600 text-xs font-bold px-3 py-1 rounded-full shadow-sm"
            >
              {cat}
            </span>
          ))}
        </div>
        {item.priority_level === 1 && (
          <div className="absolute top-3 right-3">
            <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-sm">
              Featured
            </span>
          </div>
        )}
      </div>

      <div className="p-5 flex flex-col gap-3">
        <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
          {item.name}
        </h3>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span>📍 {item.place}</span>
        </div>
        {item.phone_number && (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>📞 {item.phone_number}</span>
          </div>
        )}
        {item.description && (
          <p className="text-gray-500 text-sm line-clamp-2">
            {item.description}
          </p>
        )}
      </div>
    </article>
  );
});

export default ProjectCard;
