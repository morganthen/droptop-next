"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import AddBookmarkForm from "./AddBookmarkForm";
import Logo from "./Logo";

type HeaderProps = {
  onLogOut: () => void;
  onAdd: () => void;
  bookmarkCount?: number;
  searchTerm?: string;
  onSetSearchTerm?: (term: string) => void;
  filteredCount?: number;
};

export default function Header({
  onLogOut,
  onAdd,
  bookmarkCount = 0,
  searchTerm,
  onSetSearchTerm,
  filteredCount,
}: HeaderProps) {
  const [open, setOpen] = useState(false);

  function handleAdd() {
    onAdd();
    setOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 bg-terminal border-b-2 border-phosphor overflow-hidden">
      {/* Scanlines */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "repeating-linear-gradient(to bottom, transparent 0px, transparent 3px, rgba(0,0,0,0.1) 3px, rgba(0,0,0,0.1) 4px)",
        }}
      />
      {/* Noise */}
      <div className="bg-noise pointer-events-none absolute inset-0 opacity-30" />
      {/* Moving sweep */}
      <div
        className="scanline-sweep pointer-events-none absolute left-0 right-0 h-16"
        style={{
          background:
            "linear-gradient(to bottom, transparent 0%, rgba(200,255,0,0.015) 50%, transparent 100%)",
        }}
      />

      <div className="px-6 py-3 flex items-center justify-between relative z-10">
        <Logo />

        <span className="text-phosphor/50 font-share text-xs tracking-widest hidden md:block">
          {filteredCount ?? bookmarkCount} / {bookmarkCount} RECORDS LOADED
        </span>
        <input
          placeholder="SEARCH..."
          value={searchTerm}
          onChange={(e) => onSetSearchTerm?.(e.target.value)}
          className="bg-terminal text-phosphor placeholder-phosphor/30 font-share text-xs tracking-widest border border-phosphor/25 px-3 py-1.5 focus:outline-none focus:border-phosphor/70 transition-colors w-48"
        />

        <div className="flex items-center gap-4">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <button className="bg-phosphor text-terminal font-share font-bold text-xs tracking-widest uppercase px-4 py-2 hover:bg-phosphor/90 transition-colors">
                + ADD
              </button>
            </DialogTrigger>
            <DialogContent className="bg-screen border border-phosphor/30 text-phosphor max-w-md">
              <DialogHeader>
                <DialogTitle className="text-phosphor/60 font-share text-xs tracking-widest uppercase">
                  &gt; NEW BOOKMARK_
                </DialogTitle>
              </DialogHeader>
              <AddBookmarkForm onAdd={handleAdd} />
            </DialogContent>
          </Dialog>

          <button
            onClick={onLogOut}
            className="text-phosphor/30 hover:text-phosphor/70 font-share text-xs tracking-widest uppercase transition-colors"
          >
            LOGOUT
          </button>
        </div>
      </div>

      <div className="px-6 py-1 flex gap-6 border-t border-phosphor/10">
        <span className="text-phosphor/25 font-share text-xs tracking-widest">
          SYS OK
        </span>
        <span className="text-phosphor/25 font-share text-xs tracking-widest">
          DROPTOP v2.0
        </span>
        <span className="text-signal/20 font-share text-xs tracking-widest">
          PHOSPHOR DISPLAY ACTIVE
        </span>
      </div>
    </header>
  );
}
