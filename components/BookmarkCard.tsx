"use client";

import { Bookmark } from "@/lib/types";

type Props = {
  bookmark: Bookmark;
  onDelete: (id: number) => void;
};

export default function BookmarkCard({ bookmark, onDelete }: Props) {
  return (
    <div className="group bg-[#161616] border border-zinc-800 rounded-xl overflow-hidden hover:border-zinc-600 transition-all duration-200">
      {bookmark.imageUrl && (
        <div className="relative overflow-hidden h-40">
          <img
            src={bookmark.imageUrl}
            alt={bookmark.title ?? ""}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#161616] to-transparent opacity-60" />
        </div>
      )}

      <div className="p-4 space-y-2">
        {bookmark.title && (
          <h2 className="text-white text-sm font-bold leading-snug line-clamp-2">
            {bookmark.title}
          </h2>
        )}

        {bookmark.description && (
          <p className="text-zinc-500 text-xs leading-relaxed line-clamp-2">
            {bookmark.description}
          </p>
        )}

        <div className="flex items-center justify-between pt-2">
          <a
            href={bookmark.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#ff4d00] text-xs font-mono tracking-widest uppercase hover:text-[#ff6a2a] transition-colors"
          >
            Visit →
          </a>

          <button
            onClick={() => onDelete(bookmark.id)}
            className="text-zinc-600 hover:text-red-500 text-xs font-mono tracking-widest uppercase transition-colors"
          >
            Delete
          </button>
        </div>

        {bookmark.tags && bookmark.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 pt-1">
            {bookmark.tags.map((tag) => (
              <span
                key={tag}
                className="bg-zinc-800 text-zinc-400 text-xs px-2 py-0.5 rounded-full font-mono"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
