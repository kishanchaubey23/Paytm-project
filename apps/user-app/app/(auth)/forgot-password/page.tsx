"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<1 | 2>(1);
  const [target, setTarget] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [infoMessage, setInfoMessage] = useState("");
  const [mockOtp, setMockOtp] = useState("");
  const [success, setSuccess] = useState(false);

  const router = useRouter();

  const handleRequestCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!target) {
      setError("Please enter your Phone number or Email address.");
      return;
    }

    setLoading(true);
    setError("");
    setInfoMessage("");
    setMockOtp("");

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ target }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to send reset code");
      }

      setStep(2);
      setInfoMessage("Reset verification code sent successfully!");
      if (data.otp) {
        setMockOtp(data.otp);
      }
    } catch (err: any) {
      setError(err.message || "An error occurred. Please verify your identifier.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || !password) {
      setError("Please fill in both the verification code and the new password.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ target, code, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to reset password");
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/signin");
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Failed to reset password. The code may be incorrect or expired.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-4 py-12">
      <div className="w-full max-w-md bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-slate-200/50 p-8 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:border-slate-300/50">
        
        {/* Title */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-[#6a51a6] tracking-tight">Reset Password</h2>
          <p className="text-slate-500 mt-2 text-sm font-medium">
            {step === 1 ? "Request a verification code" : "Choose a new password"}
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-rose-50 border-l-4 border-rose-500 p-3 rounded-lg text-rose-700 text-sm font-medium mb-4">
            {error}
          </div>
        )}

        {/* Info Alert */}
        {infoMessage && (
          <div className="bg-emerald-50 border-l-4 border-emerald-500 p-3 rounded-lg text-emerald-700 text-sm font-medium mb-4">
            {infoMessage}
          </div>
        )}

        {/* Success Alert */}
        {success && (
          <div className="bg-emerald-50 border-l-4 border-emerald-500 p-3 rounded-lg text-emerald-700 text-sm font-medium mb-4">
            Password reset successfully! Redirecting to Sign In...
          </div>
        )}

        {/* Mock OTP Indicator for testing */}
        {mockOtp && (
          <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3 text-center mb-4 transition-all duration-200">
            <span className="text-indigo-800 text-xs font-semibold uppercase tracking-wider block">Dev Reset Code</span>
            <span className="text-indigo-900 text-2xl font-bold tracking-widest select-all">{mockOtp}</span>
          </div>
        )}

        {/* Step 1 Form */}
        {step === 1 && (
          <form onSubmit={handleRequestCode} className="space-y-4">
            <div>
              <label className="block text-slate-700 text-xs font-bold uppercase tracking-wider mb-2">
                Phone Number or Email
              </label>
              <input
                type="text"
                placeholder="e.g. 1234567890 or mail@example.com"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
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
                "Send Reset Code"
              )}
            </button>
          </form>
        )}

        {/* Step 2 Form */}
        {step === 2 && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <label className="block text-slate-700 text-xs font-bold uppercase tracking-wider mb-2">
                6-Digit Verification Code
              </label>
              <input
                type="text"
                maxLength={6}
                placeholder="Enter 6-digit code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-center tracking-widest font-bold text-xl focus:outline-none focus:ring-2 focus:ring-[#6a51a6]/50 focus:border-[#6a51a6] transition-all bg-slate-50/50 text-slate-800 font-medium"
              />
            </div>

            <div>
              <label className="block text-slate-700 text-xs font-bold uppercase tracking-wider mb-2">
                New Password
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
                "Reset Password"
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                setStep(1);
                setMockOtp("");
                setError("");
                setInfoMessage("");
              }}
              className="w-full text-slate-500 hover:text-slate-800 text-sm font-semibold transition-all py-2 mt-2"
            >
              Back to Step 1
            </button>
          </form>
        )}

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-slate-100 text-center text-sm font-medium">
          <p className="text-slate-500">
            Remembered your password?{" "}
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
