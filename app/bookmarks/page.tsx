"use client";

import AddBookmarkForm from "@/components/AddBookmarkForm";
import BookmarkCard from "@/components/BookmarkCard";
import { Bookmark } from "@/lib/types";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Bookmarks() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const router = useRouter();

  async function fetchBookmarks() {
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
  }

  useEffect(() => {
    fetchBookmarks();
  }, []);

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
      <nav className="border-b border-zinc-800 px-6 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-black text-white tracking-tight font-mono">
          drop<span className="text-[#ff4d00]">top</span>
        </h1>
        <button
          onClick={handleLogOut}
          className="text-zinc-500 hover:text-white text-xs tracking-widest uppercase font-mono transition-colors"
        >
          Sign Out
        </button>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8 flex gap-8">
        {/* Sidebar - Add form */}
        <aside className="w-80 shrink-0">
          <div className="sticky top-8">
            <AddBookmarkForm onAdd={handleAddBookmark} />
          </div>
        </aside>

        {/* Main - Bookmark grid */}
        <main className="flex-1">
          {bookmarks.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <p className="text-zinc-600 font-mono text-sm tracking-widest uppercase">
                No bookmarks yet
              </p>
              <p className="text-zinc-700 text-xs mt-2">
                Paste a URL on the left to get started
              </p>
            </div>
          ) : (
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
              {bookmarks.map((bookmark) => (
                <div key={bookmark.id} className="break-inside-avoid">
                  <BookmarkCard
                    bookmark={bookmark}
                    onDelete={handleDeleteBookmark}
                  />
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
