"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AddBookmarkForm({ onAdd }: { onAdd: () => void }) {
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

  const router = useRouter();

  function handleTagKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && currentTagInput.trim()) {
      e.preventDefault();

      const newTags = currentTagInput
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean)
        .filter((tag) => !formData.tags.includes(tag)); // only keep tags that don't already exist

      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, ...newTags],
      }));

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
    } catch (error) {
      console.error("Error adding bookmark:", error);
    }
  }

  async function scrapeUrl(url: string) {
    if (!url) return;
    setScraping(true);
    try {
      const response = await fetch("/api/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      if (!response.ok) return;
      const data = await response.json();
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
    <div className="bg-[#161616] border border-zinc-800 rounded-2xl p-6 space-y-4">
      <h2 className="text-white font-black font-mono text-sm tracking-widest uppercase">
        + Add Bookmark
      </h2>

      <form onSubmit={addBookmark} className="space-y-3">
        <div className="space-y-1">
          <label className="text-zinc-400 text-xs tracking-widest uppercase font-mono">
            URL
          </label>
          <div className="relative">
            <input
              placeholder="https://..."
              onChange={(e) =>
                setFormData({ ...formData, url: e.target.value })
              }
              value={formData.url}
              onBlur={(e) => scrapeUrl(e.target.value)}
              className="w-full bg-[#0e0e0e] border border-zinc-800 text-white placeholder-zinc-600 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#ff4d00] transition-colors"
            />
            {scraping && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 text-xs font-mono animate-pulse">
                scraping...
              </span>
            )}
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-zinc-400 text-xs tracking-widest uppercase font-mono">
            Title
          </label>
          <input
            placeholder="Enter title"
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            value={formData.title}
            className="w-full bg-[#0e0e0e] border border-zinc-800 text-white placeholder-zinc-600 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#ff4d00] transition-colors"
          />
        </div>

        <div className="space-y-1">
          <label className="text-zinc-400 text-xs tracking-widest uppercase font-mono">
            Description
          </label>
          <textarea
            placeholder="Enter description"
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            value={formData.description}
            rows={3}
            className="w-full bg-[#0e0e0e] border border-zinc-800 text-white placeholder-zinc-600 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#ff4d00] transition-colors resize-none"
          />
        </div>
        {/*tags*/}
        <div className="space-y-1">
          {formData.tags.length > 0 &&
            formData.tags.map((tag, index) => (
              <span
                key={index}
                className="group relative inline-flex items-center bg-zinc-800 text-white text-xs font-bold py-1 px-3 rounded-full mx-1 mb-1"
              >
                {tag}
                <button
                  onClick={() => handleDeleteTag(index)}
                  className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 rounded-full bg-zinc-600 hover:bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all text-[9px]"
                >
                  ×
                </button>
              </span>
            ))}
        </div>
        <div className="space-y-1">
          <label className="text-zinc-400 text-xs tracking-widest uppercase font-mono">
            Tags
          </label>
          <input
            placeholder="Enter tags (comma separated)"
            onChange={(e) => setCurrentTagInput(e.target.value)}
            onKeyDown={handleTagKeyDown}
            value={currentTagInput}
            className="w-full bg-[#0e0e0e] border border-zinc-800 text-white placeholder-zinc-600 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-[#ff4d00] transition-colors resize-none"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-[#ff4d00] hover:bg-[#e04400] text-white font-bold py-3 rounded-lg text-sm tracking-widest uppercase transition-colors font-mono"
        >
          Save Bookmark
        </button>
      </form>
    </div>
  );
}
