"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const inputClass =
  "w-full bg-transparent border border-phosphor/25 text-phosphor placeholder-phosphor/30 font-share text-sm px-3 py-2 focus:outline-none focus:border-phosphor/60 transition-colors";

const labelClass =
  "block text-phosphor/50 font-share text-xs tracking-widest uppercase mb-1";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleRegister(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!response.ok) {
      setError("REGISTRATION FAILED. TRY AGAIN.");
    } else {
      localStorage.setItem("token", (await response.json()).token);
      router.push("/bookmarks");
    }
  }

  return (
    <div className="min-h-screen bg-terminal flex items-center justify-center px-4 relative overflow-hidden">
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

      <div className="w-full max-w-sm z-20">
        <div className="text-center mb-10">
          <h1 className="text-7xl text-phosphor font-display tracking-widest">
            DROP<span className="text-signal">TOP</span>
          </h1>
          <p className="text-phosphor/50 font-share text-xs tracking-widest uppercase mt-2">
            BOOKMARK TERMINAL v2.0
          </p>
        </div>

        <div className="bg-screen border border-phosphor/30 p-8 space-y-5">
          <p className="text-phosphor/50 font-share text-md tracking-widest uppercase">
            &gt; CREATE NEW USER ACCOUNT_
          </p>

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className={labelClass}>USER.EMAIL</label>
              <input
                type="email"
                placeholder="user@terminal.io"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>USER.PASS</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputClass}
              />
            </div>

            {error && (
              <p className="text-signal font-share text-xs tracking-widest uppercase">
                ! {error}
              </p>
            )}

            <button
              type="submit"
              className="w-full bg-phosphor text-terminal font-share font-bold text-xs tracking-widest uppercase py-3 hover:bg-phosphor/90 transition-colors"
            >
              CREATE ACCOUNT →
            </button>

            <button
              type="button"
              onClick={() => router.push("/login")}
              className="w-full border border-phosphor/25 text-phosphor/50 font-share text-xs tracking-widest uppercase py-2 hover:border-phosphor/50 hover:text-phosphor/60 transition-colors bg-transparent"
            >
              EXISTING USER? LOGIN
            </button>
          </form>
        </div>

        <p className="text-center text-phosphor/25 font-share text-xs tracking-widest mt-4">
          SYS OK · DROPTOP TERMINAL
        </p>
      </div>
    </div>
  );
}
