"use client";

import BookmarkCard from "@/components/BookmarkCard";
import Header from "@/components/Header";

import { Bookmark } from "@/lib/types";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export default function Bookmarks() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);

  const router = useRouter();

  const fetchBookmarks = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }
      const response = await fetch("/api/bookmarks", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Failed to fetch bookmarks");
      const data = await response.json();
      setBookmarks(data);
    } catch (error) {
      console.error("Error fetching bookmarks:", error);
    }
  }, [router]);

  useEffect(() => {
    fetchBookmarks();
  }, [fetchBookmarks]);

  function handleLogOut() {
    localStorage.removeItem("token");
    router.push("/login");
  }

  function handleAddBookmark() {
    fetchBookmarks();
  }

  async function handleDeleteBookmark(id: number) {
    setBookmarks((prev) => prev.filter((bookmark) => bookmark.id !== id));
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }
      const response = await fetch(`/api/bookmarks/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Failed to delete bookmark");
    } catch (error) {
      console.error("Error deleting bookmark:", error);
    }
  }

  return (
    <div className="min-h-screen bg-[#0e0e0e]">
      {/* Navbar */}
      <Header onLogOut={handleLogOut} onAdd={handleAddBookmark} />
      {/* Masonry grid */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {bookmarks.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <p className="text-zinc-600 font-mono text-sm tracking-widest uppercase">
              No bookmarks yet
            </p>
            <p className="text-zinc-700 text-xs mt-2">
              Hit + Add to save your first bookmark
            </p>
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
            {bookmarks.map((bookmark) => (
              <div key={bookmark.id} className="break-inside-avoid">
                <BookmarkCard
                  bookmark={bookmark}
                  onDelete={handleDeleteBookmark}
                  onAdd={fetchBookmarks}
                />
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
