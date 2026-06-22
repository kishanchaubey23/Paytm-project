"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignInPage() {
  const [activeTab, setActiveTab] = useState<"password" | "otp">("password");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [infoMessage, setInfoMessage] = useState("");
  const [mockOtp, setMockOtp] = useState("");

  const router = useRouter();

  const handleSendOtp = async () => {
    if (!identifier) {
      setError("Please enter your Phone number or Email to receive an OTP.");
      return;
    }

    setLoading(true);
    setError("");
    setInfoMessage("");
    setMockOtp("");

    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ target: identifier }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to send OTP");
      }

      setOtpSent(true);
      setInfoMessage("Verification code sent successfully!");
      if (data.otp) {
        setMockOtp(data.otp);
      }
    } catch (err: any) {
      setError(err.message || "An error occurred while sending OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier || !password) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        phone: identifier,
        password,
        loginType: "password",
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid credentials. Please try again.");
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier || !otp) {
      setError("Please enter the verification code.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        phone: identifier,
        otp,
        loginType: "otp",
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid or expired OTP. Please try again.");
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-4 py-12">
      <div className="w-full max-w-md bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-slate-200/50 p-8 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:border-slate-300/50">
        
        {/* Title & Subtitle */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-[#6a51a6] tracking-tight">Welcome to PayTM</h2>
          <p className="text-slate-500 mt-2 text-sm font-medium">Access your digital wallet securely</p>
        </div>

        {/* Tab Switcher */}
        <div className="flex p-1 bg-slate-100 rounded-xl mb-6">
          <button
            type="button"
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${
              activeTab === "password"
                ? "bg-white text-[#6a51a6] shadow-sm"
                : "text-slate-500 hover:text-slate-800"
            }`}
            onClick={() => {
              setActiveTab("password");
              setError("");
              setInfoMessage("");
            }}
          >
            Password Login
          </button>
          <button
            type="button"
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${
              activeTab === "otp"
                ? "bg-white text-[#6a51a6] shadow-sm"
                : "text-slate-500 hover:text-slate-800"
            }`}
            onClick={() => {
              setActiveTab("otp");
              setError("");
              setInfoMessage("");
            }}
          >
            OTP Login / Auto Signup
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-rose-50 border-l-4 border-rose-500 p-3 rounded-lg text-rose-700 text-sm font-medium mb-4 animate-shake">
            {error}
          </div>
        )}

        {/* Info Alert */}
        {infoMessage && (
          <div className="bg-emerald-50 border-l-4 border-emerald-500 p-3 rounded-lg text-emerald-700 text-sm font-medium mb-4">
            {infoMessage}
          </div>
        )}

        {/* Mock OTP Indicator for testing */}
        {mockOtp && (
          <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3 text-center mb-4 transition-all duration-200">
            <span className="text-indigo-800 text-xs font-semibold uppercase tracking-wider block">Dev Verification Mode Code</span>
            <span className="text-indigo-900 text-2xl font-bold tracking-widest select-all">{mockOtp}</span>
          </div>
        )}

        {/* Password Login Form */}
        {activeTab === "password" && (
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label className="block text-slate-700 text-xs font-bold uppercase tracking-wider mb-2">
                Phone Number or Email
              </label>
              <input
                type="text"
                placeholder="e.g. 1234567890 or mail@example.com"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#6a51a6]/50 focus:border-[#6a51a6] transition-all bg-slate-50/50 hover:bg-slate-50 text-slate-800 font-medium"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-slate-700 text-xs font-bold uppercase tracking-wider">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs font-semibold text-[#6a51a6] hover:text-[#553b8a] transition-all"
                >
                  Forgot Password?
                </Link>
              </div>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#6a51a6]/50 focus:border-[#6a51a6] transition-all bg-slate-50/50 hover:bg-slate-50 text-slate-800 font-medium"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#6a51a6] text-white py-3 rounded-xl font-bold hover:bg-[#553b8a] active:scale-[0.98] transition-all duration-150 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                "Sign In"
              )}
            </button>
          </form>
        )}

        {/* OTP Login Form */}
        {activeTab === "otp" && (
          <form onSubmit={handleOtpSubmit} className="space-y-4">
            <div>
              <label className="block text-slate-700 text-xs font-bold uppercase tracking-wider mb-2">
                Phone Number or Email
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. 1234567890 or mail@example.com"
                  value={identifier}
                  onChange={(e) => {
                    setIdentifier(e.target.value);
                    setOtpSent(false);
                    setMockOtp("");
                  }}
                  disabled={otpSent}
                  className="flex-1 px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#6a51a6]/50 focus:border-[#6a51a6] transition-all bg-slate-50/50 hover:bg-slate-50 text-slate-800 font-medium disabled:opacity-60"
                />
                {!otpSent && (
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={loading}
                    className="px-4 bg-[#6a51a6] text-white rounded-xl font-semibold hover:bg-[#553b8a] transition-all shadow-sm disabled:opacity-50"
                  >
                    Send OTP
                  </button>
                )}
              </div>
            </div>

            {otpSent && (
              <div className="animate-slideUp">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-slate-700 text-xs font-bold uppercase tracking-wider">
                    6-Digit Verification Code
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setOtpSent(false);
                      setMockOtp("");
                    }}
                    className="text-xs font-semibold text-[#6a51a6] hover:text-[#553b8a]"
                  >
                    Change Identifier
                  </button>
                </div>
                <input
                  type="text"
                  maxLength={6}
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-center tracking-widest font-bold text-xl focus:outline-none focus:ring-2 focus:ring-[#6a51a6]/50 focus:border-[#6a51a6] transition-all bg-slate-50/50 text-slate-800"
                />

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#6a51a6] text-white py-3 rounded-xl font-bold hover:bg-[#553b8a] active:scale-[0.98] transition-all duration-150 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    "Verify & Sign In"
                  )}
                </button>
              </div>
            )}
          </form>
        )}

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-slate-100 text-center text-sm font-medium">
          <p className="text-slate-500">
            Don't have an account?{" "}
            <Link
              href="/signup"
              className="text-[#6a51a6] font-bold hover:text-[#553b8a] transition-all"
            >
              Sign Up
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}
