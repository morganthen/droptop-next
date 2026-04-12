"use client";

import BookmarkCard from "@/components/BookmarkCard";
import Header from "@/components/Header";
import { Bookmark } from "@/lib/types";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export default function Bookmarks() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

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

  const filteredBookmarks = debouncedSearch
    ? bookmarks.filter((b) => {
        const term = debouncedSearch.toLowerCase();
        return (
          b.title?.toLowerCase().includes(term) ||
          b.description?.toLowerCase().includes(term) ||
          b.url.toLowerCase().includes(term) ||
          b.tags.some((tag) => tag.toLowerCase().includes(term))
        );
      })
    : bookmarks;

  return (
    <div className="min-h-screen bg-terminal relative">
      {/* Static scanlines */}
      <div
        className="pointer-events-none fixed inset-0 z-10"
        style={{
          background:
            "repeating-linear-gradient(to bottom, transparent 0px, transparent 3px, rgba(0,0,0,0.12) 3px, rgba(0,0,0,0.12) 4px)",
        }}
      />
      {/* Moving sweep */}
      <div
        className="scanline-sweep pointer-events-none fixed left-0 right-0 h-32 z-10"
        style={{
          background:
            "linear-gradient(to bottom, transparent 0%, rgba(200,255,0,0.015) 50%, transparent 100%)",
        }}
      />
      {/* Noise */}
      <div className="bg-noise pointer-events-none fixed inset-0 z-10 opacity-40" />

      <div className="relative z-20">
        <Header
          onLogOut={handleLogOut}
          onAdd={handleAddBookmark}
          bookmarkCount={bookmarks.length}
          filteredCount={filteredBookmarks.length}
          searchTerm={searchTerm}
          onSetSearchTerm={setSearchTerm}
        />

        <main className="max-w-7xl mx-auto px-6 py-8">
          {bookmarks.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center space-y-3">
              <p className="text-phosphor/25 font-share text-sm tracking-widest uppercase">
                &gt; NO RECORDS FOUND
              </p>
              <p className="text-phosphor/25 font-share text-xs tracking-widest">
                PRESS + ADD TO INSERT FIRST RECORD
              </p>
              <span className="text-phosphor/25 font-share text-xs animate-pulse">
                █
              </span>
            </div>
          ) : filteredBookmarks.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center space-y-3">
              <p className="text-phosphor/25 font-share text-sm tracking-widest uppercase">
                &gt; NO RESULTS FOR "{debouncedSearch.toUpperCase()}"
              </p>
              <p className="text-phosphor/25 font-share text-xs tracking-widest">
                TRY A DIFFERENT SEARCH TERM
              </p>
            </div>
          ) : (
            <div className="columns-2 sm:columns-3 lg:columns-4 xl:columns-5 gap-3 space-y-3">
              {filteredBookmarks.map((bookmark) => (
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
    </div>
  );
}
