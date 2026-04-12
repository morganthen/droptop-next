"use client";

import { Bookmark } from "@/lib/types";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  bookmark: Bookmark;
  onDelete: (id: number) => void;
  onAdd: () => void;
};

const PencilIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-white"
  >
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

const editInputClass =
  "w-full bg-[#0e0e0e] border border-zinc-700 text-white placeholder-zinc-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#ff4d00] transition-colors";

export default function BookmarkCard({ bookmark, onDelete, onAdd }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    title: bookmark.title || "",
    description: bookmark.description || "",
    imageUrl: bookmark.imageUrl || "",
    tags: bookmark.tags || [],
  });
  const [currentTagInput, setCurrentTagInput] = useState("");
  const router = useRouter();

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
    // Reset editData back to original bookmark values on cancel
    setEditData({
      title: bookmark.title || "",
      description: bookmark.description || "",
      imageUrl: bookmark.imageUrl || "",
      tags: bookmark.tags || [],
    });
    setCurrentTagInput("");
    setIsEditing(false);
  }

  return (
    <div
      className={`group bg-[#161616] border rounded-xl overflow-hidden transition-all duration-200 ${
        isEditing
          ? "border-[#ff4d00]/50"
          : "border-zinc-800 hover:border-zinc-600"
      }`}
    >
      {/* Image area */}
      {bookmark.imageUrl ? (
        <div className="relative overflow-hidden h-40">
          <Image
            src={bookmark.imageUrl}
            alt={bookmark.title ?? ""}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-linear-to-t from-[#161616] to-transparent opacity-60" />
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 hover:bg-black/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 backdrop-blur-sm"
            >
              <PencilIcon />
            </button>
          )}
        </div>
      ) : (
        <div className="relative h-10 bg-zinc-900">
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 hover:bg-black/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 backdrop-blur-sm"
            >
              <PencilIcon />
            </button>
          )}
        </div>
      )}

      <div className="p-4 space-y-3">
        {isEditing ? (
          <>
            {/* Edit mode label */}
            <p className="text-[#ff4d00] text-xs font-mono tracking-widest uppercase mb-1">
              Editing
            </p>

            {/* Title input */}
            <div className="space-y-1">
              <label className="text-zinc-500 text-xs font-mono tracking-widest uppercase">
                Title
              </label>
              <input
                type="text"
                value={editData.title}
                onChange={(e) =>
                  setEditData({ ...editData, title: e.target.value })
                }
                className={editInputClass}
                placeholder="Title"
              />
            </div>

            {/* Description input */}
            <div className="space-y-1">
              <label className="text-zinc-500 text-xs font-mono tracking-widest uppercase">
                Description
              </label>
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

            {/* Tags */}
            <div className="space-y-2">
              <label className="text-zinc-500 text-xs font-mono tracking-widest uppercase">
                Tags
              </label>
              {editData.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {editData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="group/tag relative inline-flex items-center bg-zinc-800 text-white text-xs font-bold py-1 px-3 rounded-full"
                    >
                      {tag}
                      <button
                        onClick={() => handleDeleteEditTag(index)}
                        className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 rounded-full bg-zinc-600 hover:bg-red-500 text-white flex items-center justify-center opacity-0 group-hover/tag:opacity-100 transition-all text-[9px]"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
              <input
                placeholder="Type a tag and hit Enter"
                onKeyDown={handleTagKeyDown}
                onChange={(e) => setCurrentTagInput(e.target.value)}
                value={currentTagInput}
                className={editInputClass}
              />
            </div>

            {/* Action buttons */}
            <div className="flex gap-2 pt-1">
              <button
                onClick={handleSaveEdits}
                className="flex-1 bg-[#ff4d00] hover:bg-[#e04400] text-white font-bold py-2 rounded-lg text-xs tracking-widest uppercase transition-colors font-mono"
              >
                Save
              </button>
              <button
                onClick={handleCancel}
                className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold py-2 rounded-lg text-xs tracking-widest uppercase transition-colors font-mono"
              >
                Cancel
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Display mode */}
            <h2 className="text-white text-sm font-bold leading-snug line-clamp-2">
              {bookmark.title || bookmark.url}
            </h2>

            {bookmark.description && (
              <p className="text-zinc-500 text-xs leading-relaxed line-clamp-3">
                {bookmark.description}
              </p>
            )}

            {bookmark.tags && bookmark.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
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

            <div className="flex items-center justify-between pt-2 border-t border-zinc-800">
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
          </>
        )}
      </div>
    </div>
  );
}
