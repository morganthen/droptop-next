"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!response.ok) {
      setError("Login failed. Please check your credentials.");
    } else {
      localStorage.setItem("token", (await response.json()).token);
      router.push("/bookmarks");
    }
  }

  return (
    <div className="min-h-screen bg-[#0e0e0e] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-black text-white tracking-tight font-mono">
            drop<span className="text-[#ff4d00]">top</span>
          </h1>
          <p className="text-zinc-500 text-sm mt-2 tracking-widest uppercase">
            your bookmarks, organised
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-[#161616] border border-zinc-800 rounded-2xl p-8 space-y-5"
        >
          <div className="space-y-1">
            <label className="text-zinc-400 text-xs tracking-widest uppercase font-mono">
              Email
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#0e0e0e] border border-zinc-800 text-white placeholder-zinc-600 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#ff4d00] transition-colors"
            />
          </div>

          <div className="space-y-1">
            <label className="text-zinc-400 text-xs tracking-widest uppercase font-mono">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#0e0e0e] border border-zinc-800 text-white placeholder-zinc-600 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#ff4d00] transition-colors"
            />
          </div>

          {error && <p className="text-[#ff4d00] text-xs font-mono">{error}</p>}

          <button
            type="submit"
            className="w-full bg-[#ff4d00] hover:bg-[#e04400] text-white font-bold py-3 rounded-lg text-sm tracking-widest uppercase transition-colors font-mono"
          >
            Sign In
          </button>

          <button
            type="button"
            onClick={() => router.push("/register")}
            className="w-full text-zinc-500 hover:text-white text-xs tracking-widest uppercase transition-colors font-mono py-1"
          >
            No account? Register
          </button>
        </form>
      </div>
    </div>
  );
}
