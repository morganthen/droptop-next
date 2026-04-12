"use client";

import { Bookmark } from "@/lib/types";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

type Props = {
  bookmark: Bookmark;
  onDelete: (id: number) => void;
  onAdd: () => void;
};

const editInputClass =
  "w-full bg-transparent border border-phosphor/25 text-phosphor placeholder-phosphor/30 font-share text-xs tracking-wide px-3 py-2 focus:outline-none focus:border-phosphor/50 transition-colors";

const editLabelClass =
  "block text-phosphor/30 font-share text-xs tracking-widest uppercase mb-1";

const NoSignal = ({
  onEdit,
  isEditing,
}: {
  onEdit: () => void;
  isEditing: boolean;
}) => (
  <div className="relative h-40 flex flex-col items-center justify-center border-b border-phosphor/5 bg-terminal">
    <svg
      width="48"
      height="48"
      viewBox="0 0 24 24"
      fill="none"
      className="opacity-10"
    >
      <rect
        x="2"
        y="3"
        width="20"
        height="14"
        rx="1"
        stroke="#c8ff00"
        strokeWidth="1.5"
      />
      <path
        d="M8 21h8M12 17v4"
        stroke="#c8ff00"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M7 8l2 2-2 2M12 7v2M17 8l-2 2 2 2"
        stroke="#c8ff00"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
    <span className="mt-2 font-share text-xs tracking-widest text-phosphor\/25 uppercase">
      NO SIGNAL
    </span>
    {!isEditing && (
      <button
        onClick={onEdit}
        className="absolute top-2 right-2 bg-phosphor text-terminal font-share text-xs px-2 py-0.5 tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-all"
      >
        EDIT
      </button>
    )}
  </div>
);

export default function BookmarkCard({ bookmark, onDelete, onAdd }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [editData, setEditData] = useState({
    title: bookmark.title || "",
    description: bookmark.description || "",
    imageUrl: bookmark.imageUrl || "",
    tags: bookmark.tags || [],
  });
  const [currentTagInput, setCurrentTagInput] = useState("");
  const router = useRouter();

  const scanDelay = useRef(`-${Math.random() * 4}s`);
  const scanDuration = useRef(`${3 + Math.random() * 3}s`);

  function handleDeleteEditTag(index: number) {
    setEditData((prev) => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index),
    }));
  }

  function handleTagKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && currentTagInput.trim()) {
      e.preventDefault();
      const newTags = currentTagInput
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean)
        .filter((tag) => !editData.tags.includes(tag));
      setEditData((prev) => ({ ...prev, tags: [...prev.tags, ...newTags] }));
      setCurrentTagInput("");
    }
  }

  async function handleSaveEdits() {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }
      const response = await fetch(`/api/bookmarks/${bookmark.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editData),
      });
      if (!response.ok) throw new Error("Failed to update bookmark");
      setIsEditing(false);
      onAdd();
    } catch (error) {
      console.error("Error updating bookmark:", error);
    }
  }

  function handleCancel() {
    setEditData({
      title: bookmark.title || "",
      description: bookmark.description || "",
      imageUrl: bookmark.imageUrl || "",
      tags: bookmark.tags || [],
    });
    setCurrentTagInput("");
    setIsEditing(false);
  }

  const hasValidImage =
    bookmark.imageUrl && bookmark.imageUrl.startsWith("http") && !imgError;

  return (
    <div
      className={`group bg-screen overflow-hidden transition-all duration-200 ${
        isEditing
          ? "border border-phosphor/50"
          : "border border-phosphor/10 hover:border-phosphor/30"
      }`}
    >
      {/* Image area */}
      {hasValidImage ? (
        <div className="relative overflow-hidden h-32">
          <Image
            src={bookmark.imageUrl!}
            alt={bookmark.title ?? ""}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            onError={() => setImgError(true)}
            style={{
              filter: "saturate(0.8) brightness(0.95) contrast(1.1)",
              opacity: 0.8,
            }}
          />
          {/* Gradient fade */}
          <div className="absolute inset-0 bg-linear-to-t from-screen to-transparent" />
          {/* Static scanlines */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "repeating-linear-gradient(to bottom, transparent 0px, transparent 3px, rgba(0,0,0,0.25) 3px, rgba(0,0,0,0.25) 4px)",
            }}
          />
          {/* Moving scanline sweep */}
          <div
            className="scanline-sweep absolute left-0 right-0 h-8 pointer-events-none"
            style={{
              background:
                "linear-gradient(to bottom, transparent 0%, rgba(255,255,255,0.03) 50%, transparent 100%)",
              animationDelay: scanDelay.current,
              animationDuration: scanDuration.current,
            }}
          />
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="absolute top-2 right-2 bg-phosphor text-terminal font-share text-xs px-2 py-0.5 tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-all"
            >
              EDIT
            </button>
          )}
        </div>
      ) : (
        <NoSignal onEdit={() => setIsEditing(true)} isEditing={isEditing} />
      )}

      <div className="p-3 space-y-3">
        {isEditing ? (
          <>
            <p
              className="text-phosphor/60
             font-share text-xs tracking-widest uppercase"
            >
              &gt; EDIT MODE ACTIVE_
            </p>

            <div>
              <label className={editLabelClass}>TITLE</label>
              <input
                value={editData.title}
                onChange={(e) =>
                  setEditData({ ...editData, title: e.target.value })
                }
                className={editInputClass}
                placeholder="Title"
              />
            </div>

            <div>
              <label className={editLabelClass}>DESC</label>
              <textarea
                value={editData.description}
                onChange={(e) =>
                  setEditData({ ...editData, description: e.target.value })
                }
                className={`${editInputClass} resize-none`}
                placeholder="Description"
                rows={3}
              />
            </div>

            <div>
              <label className={editLabelClass}>TAGS</label>
              {editData.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-2">
                  {editData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="group/tag relative inline-flex items-center border border-phosphor/25 text-phosphor/50 font-share text-xs px-2 py-0.5"
                    >
                      {tag}
                      <button
                        onClick={() => handleDeleteEditTag(index)}
                        className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-signal text-terminal flex items-center justify-center opacity-0 group-hover/tag:opacity-100 transition-all text-[9px]"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
              <input
                placeholder="TYPE TAG + ENTER"
                onKeyDown={handleTagKeyDown}
                onChange={(e) => setCurrentTagInput(e.target.value)}
                value={currentTagInput}
                className={editInputClass}
              />
            </div>

            <div className="flex gap-2 pt-1">
              <button
                onClick={handleSaveEdits}
                className="flex-1 bg-phosphor text-terminal font-share font-bold text-xs tracking-widest uppercase py-2 hover:bg-phosphor/90 transition-colors"
              >
                SAVE
              </button>
              <button
                onClick={handleCancel}
                className="flex-1 border border-phosphor/25 text-phosphor/50 font-share text-xs tracking-widest uppercase py-2 hover:border-phosphor/50 transition-colors bg-transparent"
              >
                CANCEL
              </button>
            </div>
          </>
        ) : (
          <>
            <h2 className="text-phosphor font-share text-sm leading-snug line-clamp-2 tracking-wide">
              {bookmark.title || bookmark.url}
            </h2>

            {bookmark.description && (
              <p className="text-phosphor/50 font-share text-xs leading-relaxed line-clamp-3">
                {bookmark.description}
              </p>
            )}

            {bookmark.tags && bookmark.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {bookmark.tags.map((tag) => (
                  <span
                    key={tag}
                    className="border border-phosphor/25 text-phosphor/50 font-share text-xs px-2 py-0.5"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <div className="flex items-center justify-between pt-2 border-t border-phosphor/10">
              <a
                href={bookmark.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-signal font-share text-xs tracking-widest uppercase hover:text-signal/70 transition-colors"
              >
                VISIT →
              </a>
              <button
                onClick={() => onDelete(bookmark.id)}
                className="text-phosphor/25 hover:text-signal font-share text-xs tracking-widest uppercase transition-colors"
              >
                DELETE
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
