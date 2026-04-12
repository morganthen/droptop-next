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

type HeaderProps = {
  onLogOut: () => void;
  onAdd: () => void;
};

export default function Header({ onLogOut, onAdd }: HeaderProps) {
  const [open, setOpen] = useState(false);

  function handleAdd() {
    onAdd();
    setOpen(false);
  }
  return (
    <header className="sticky top-0 z-50 bg-[#0e0e0e] border-b border-zinc-800">
      <nav className="px-6 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-black text-white tracking-tight font-mono">
          drop<span className="text-[#ff4d00]">top</span>
        </h1>
        <div className="flex items-center gap-4">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <button className="bg-[#ff4d00] hover:bg-[#e04400] text-white text-xs font-bold font-mono tracking-widest uppercase px-4 py-2 rounded-lg transition-colors">
                + Add
              </button>
            </DialogTrigger>
            <DialogContent className="bg-[#161616] border border-zinc-800 text-white max-w-md">
              <DialogHeader>
                <DialogTitle className="text-white font-mono text-sm tracking-widest uppercase font-black">
                  Add Bookmark
                </DialogTitle>
              </DialogHeader>
              <AddBookmarkForm onAdd={handleAdd} />
            </DialogContent>
          </Dialog>

          <button
            onClick={onLogOut}
            className="text-zinc-500 hover:text-white text-xs tracking-widest uppercase font-mono transition-colors"
          >
            Sign Out
          </button>
        </div>
      </nav>
    </header>
  );
}
