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
      onClick={() => onClick(item)}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white/80 shadow-sm ring-1 ring-black/[0.02] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-100 hover:shadow-[0_18px_45px_rgba(15,23,42,0.16)]"
      role="button"
      tabIndex={0}
      aria-label={`${item.name} in ${item.place}`}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onClick(item);
      }}
    >
      <div className="relative h-56 w-full overflow-hidden bg-linear-to-t from-slate-100 to-slate-200">
        {item.image_url && (
          <Image
            src={item.image_url}
            alt={item.name}
            fill
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            loading="lazy"
          />
        )}

        {/* Gradient overlay for better text legibility */}
        <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/35 via-black/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        {/* Category pills */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          {item.category.slice(0, 2).map((cat, index) => (
            <span
              key={index}
              className="rounded-full bg-white/92 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-sky-700 shadow-sm ring-1 ring-sky-100"
            >
              {cat}
            </span>
          ))}
          {item.category.length > 2 && (
            <span className="rounded-full bg-slate-900/80 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-slate-50 shadow-sm">
              +{item.category.length - 2} more
            </span>
          )}
        </div>

        {/* Featured badge */}
        {item.priority_level === 1 && (
          <div className="absolute right-3 top-3">
            <span className="inline-flex items-center gap-1 rounded-full bg-[#1b447a] px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white shadow-md shadow-[#1b447a]/40">
              <span className="h-1 w-1 rounded-full bg-white shadow-[0_0_0_3px_rgba(250,250,249,0.4)] animate-ping" />
              Featured
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="line-clamp-2 text-base font-semibold tracking-tight text-slate-900 transition-colors duration-200 group-hover:text-[#1b447a]">
            {item.name}
          </h3>
        </div>

        <div className="flex flex-col gap-1.5 text-sm text-slate-500">
          <div className="inline-flex items-center gap-1.5">
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-blue-50 text-[11px] text-blue-600">
              📍
            </span>
            <span className="line-clamp-1 font-medium text-slate-700">
              {item.place}
            </span>
          </div>

          {item.phone_number && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                window.location.href = `tel:${item.phone_number}`;
              }}
              className="group/phone inline-flex w-fit items-center gap-1.5 text-xs font-medium text-slate-500 underline-offset-4 hover:text-blue-600 hover:underline"
            >
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-50 text-[11px] text-emerald-600">
                📞
              </span>
              <span>{item.phone_number}</span>
            </button>
          )}
        </div>

        {item.description && (
          <p className="line-clamp-2 text-sm leading-relaxed text-slate-500">
            {item.description}
          </p>
        )}

        {/* Bottom meta row */}
        <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
          <span className="inline-flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Verified partner
          </span>
          <span className="rounded-full bg-slate-50 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-slate-500">
            Tap for details
          </span>
        </div>
      </div>
    </article>
  );
});

export default ProjectCard;
