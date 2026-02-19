"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

const apiBaseUrl = "/api";

type LoginResponse = {
  id: number;
  name: string;
  email: string;
  token: string;
};

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError(null);
    setLoading(true);

    try {
      const response = await fetch(`${apiBaseUrl}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        setError("Invalid email or password.");
        return;
      }

      const data: LoginResponse = await response.json();
      localStorage.setItem("taskapp_token", data.token);
      router.push("/dashboard");
    } catch {
      setError("Could not connect to backend API.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-linear-to-br from-violet-100 via-fuchsia-50 to-cyan-100 px-6 py-10">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_15%_20%,rgba(244,114,182,0.12),transparent_35%),radial-gradient(circle_at_85%_25%,rgba(167,139,250,0.12),transparent_40%),radial-gradient(circle_at_50%_90%,rgba(34,211,238,0.12),transparent_40%)]" />

      <div className="mx-auto w-full max-w-3xl rounded-3xl border border-violet-200/70 bg-white/75 p-3 shadow-[0_18px_45px_-20px_rgba(124,58,237,0.45)] backdrop-blur">
        <div className="rounded-2xl border border-fuchsia-100 bg-white/90 p-8 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
          <div className="rounded-2xl border border-violet-100 bg-linear-to-r from-violet-50 via-fuchsia-50 to-cyan-50 p-4">
         
            <h1 className="mt-1 text-3xl font-semibold text-violet-500">Task Notebook</h1>
            <p className="mt-1 text-sm text-violet-700">✨Welcome back! Ready to slay your to-do list?✨.</p>
          </div>

          <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="mb-1 block text-sm font-medium text-violet-800" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-xl border border-violet-200 bg-white px-3 py-2 text-zinc-900 outline-none transition focus:border-violet-400"
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-violet-800" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-xl border border-violet-200 bg-white px-3 py-2 text-zinc-900 outline-none transition focus:border-violet-400"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-fuchsia-600 px-4 py-2 font-semibold text-white shadow transition hover:scale-[1.01] hover:bg-fuchsia-500 disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {error ? <p className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p> : null}
        </div>
      </div>
    </main>
  );
}
