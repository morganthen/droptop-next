"use client";

import { Bookmark } from "@/lib/types";
import { useRouter } from "next/navigation";
import { useState } from "react";

const inputClass =
  "w-full bg-transparent border border-phosphor/25 text-phosphor placeholder-phosphor/30 font-share text-xs tracking-wide px-3 py-2 focus:outline-none focus:border-phosphor/50 transition-colors";

const labelClass =
  "block text-phosphor/50 font-share text-xs tracking-widest uppercase mb-1";

export default function AddBookmarkForm({
  onAdd,
  bookmarks,
}: {
  onAdd: () => void;
  bookmarks: Bookmark[];
}) {
  const [formData, setFormData] = useState<{
    url: string;
    title: string;
    description: string;
    imageUrl: string;
    tags: string[];
  }>({
    url: "",
    title: "",
    description: "",
    imageUrl: "",
    tags: [],
  });

  const [currentTagInput, setCurrentTagInput] = useState("");
  const [scraping, setScraping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  function handleTagKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && currentTagInput.trim()) {
      e.preventDefault();
      const newTags = currentTagInput
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean)
        .filter((tag) => !formData.tags.includes(tag));
      setFormData((prev) => ({ ...prev, tags: [...prev.tags, ...newTags] }));
      setCurrentTagInput("");
    }
  }

  function handleDeleteTag(index: number) {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index),
    }));
  }

  async function addBookmark(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }
      const isDuplicate = bookmarks.some((b) => b.url === formData.url);
      if (isDuplicate) {
        setError("! URL ALREADY EXISTS IN DATABASE");
        return;
      }
      const response = await fetch("/api/bookmarks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error("Failed to add bookmark");
      onAdd();
      setFormData({
        url: "",
        title: "",
        description: "",
        imageUrl: "",
        tags: [],
      });
      setError("");
    } catch (error) {
      console.error("Error adding bookmark:", error);
    }
  }

  async function scrapeUrl(url: string) {
    console.log("scrapeUrl called with:", url);
    if (!url) return;
    try {
      new URL(url);
    } catch {
      return;
    }
    setScraping(true);
    try {
      const response = await fetch("/api/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      if (response.status === 422) {
        setError("! URL IS NOT REACHABLE");
        return; // finally will handle setScraping(false)
      }
      if (!response.ok) return;
      const data = await response.json();
      setError("");
      setFormData((prev) => ({
        ...prev,
        title: data.result.ogTitle || "",
        description: data.result.ogDescription || "",
        imageUrl:
          data.result.ogImage && data.result.ogImage.length > 0
            ? data.result.ogImage[0].url
            : "",
      }));
    } finally {
      setScraping(false);
    }
  }

  return (
    <form onSubmit={addBookmark} className="space-y-4">
      <div>
        <label className={labelClass}>URL.INPUT</label>
        <div className="relative">
          <input
            placeholder="https://..."
            onChange={(e) => setFormData({ ...formData, url: e.target.value })}
            value={formData.url}
            onBlur={(e) => scrapeUrl(e.target.value)}
            className={inputClass}
          />
          {scraping && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-phosphor/50 font-share text-xs animate-pulse">
              SCANNING...
            </span>
          )}
        </div>
      </div>

      <div>
        <label className={labelClass}>PAGE.TITLE</label>
        <input
          placeholder="Enter title"
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          value={formData.title}
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass}>PAGE.DESC</label>
        <textarea
          placeholder="Enter description"
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          value={formData.description}
          rows={3}
          className={`${inputClass} resize-none`}
        />
      </div>

      <div>
        <label className={labelClass}>META.TAGS</label>
        {formData.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {formData.tags.map((tag, index) => (
              <span
                key={index}
                className="group relative inline-flex items-center border border-phosphor/25 text-phosphor/60 font-share text-xs px-2 py-0.5"
              >
                {tag}
                <button
                  onClick={() => handleDeleteTag(index)}
                  className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-signal text-terminal flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all text-[9px]"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
        <input
          placeholder="TYPE TAG + ENTER"
          onChange={(e) => setCurrentTagInput(e.target.value)}
          onKeyDown={handleTagKeyDown}
          value={currentTagInput}
          className={inputClass}
        />
      </div>
      {error && (
        <p className="text-signal font-share text-xs tracking-widest uppercase">
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={scraping}
        className="w-full bg-phosphor text-terminal font-share font-bold text-xs tracking-widest uppercase py-3 hover:bg-phosphor/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        SAVE TO DATABASE →
      </button>
    </form>
  );
}
