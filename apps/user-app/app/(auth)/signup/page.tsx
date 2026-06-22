"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignUpPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email && !phone) {
      setError("Please enter at least an Email address or Phone number.");
      return;
    }
    if (!password) {
      setError("Please set a password.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to sign up");
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/signin");
      }, 2000);
    } catch (err: any) {
      setError(err.message || "An error occurred during sign up.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-4 py-12">
      <div className="w-full max-w-md bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-slate-200/50 p-8 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:border-slate-300/50">
        
        {/* Title */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-[#6a51a6] tracking-tight">Create Account</h2>
          <p className="text-slate-500 mt-2 text-sm font-medium">Join PayTM wallet today</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-rose-50 border-l-4 border-rose-500 p-3 rounded-lg text-rose-700 text-sm font-medium mb-4">
            {error}
          </div>
        )}

        {/* Success Alert */}
        {success && (
          <div className="bg-emerald-50 border-l-4 border-emerald-500 p-3 rounded-lg text-emerald-700 text-sm font-medium mb-4">
            Account created successfully! Redirecting to Sign In...
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-slate-700 text-xs font-bold uppercase tracking-wider mb-2">
              Full Name
            </label>
            <input
              type="text"
              placeholder="e.g. Jane Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#6a51a6]/50 focus:border-[#6a51a6] transition-all bg-slate-50/50 hover:bg-slate-50 text-slate-800 font-medium"
            />
          </div>

          <div>
            <label className="block text-slate-700 text-xs font-bold uppercase tracking-wider mb-2">
              Email Address
            </label>
            <input
              type="email"
              placeholder="e.g. jane@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#6a51a6]/50 focus:border-[#6a51a6] transition-all bg-slate-50/50 hover:bg-slate-50 text-slate-800 font-medium"
            />
          </div>

          <div>
            <label className="block text-slate-700 text-xs font-bold uppercase tracking-wider mb-2">
              Phone Number
            </label>
            <input
              type="text"
              placeholder="e.g. 1234567890"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#6a51a6]/50 focus:border-[#6a51a6] transition-all bg-slate-50/50 hover:bg-slate-50 text-slate-800 font-medium"
            />
          </div>

          <div>
            <label className="block text-slate-700 text-xs font-bold uppercase tracking-wider mb-2">
              Password
            </label>
            <input
              type="password"
              placeholder="Min. 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#6a51a6]/50 focus:border-[#6a51a6] transition-all bg-slate-50/50 hover:bg-slate-50 text-slate-800 font-medium"
            />
          </div>

          <button
            type="submit"
            disabled={loading || success}
            className="w-full bg-[#6a51a6] text-white py-3 rounded-xl font-bold hover:bg-[#553b8a] active:scale-[0.98] transition-all duration-150 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              "Sign Up"
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-slate-100 text-center text-sm font-medium">
          <p className="text-slate-500">
            Already have an account?{" "}
            <Link
              href="/signin"
              className="text-[#6a51a6] font-bold hover:text-[#553b8a] transition-all"
            >
              Sign In
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}
