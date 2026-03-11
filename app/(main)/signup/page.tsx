"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { sendOtp, verifyOtp } from "@/api/auth";

const RESEND_COOLDOWN_SECONDS = 60;

export default function SignUpPage() {
  const router = useRouter();
  const { setAuth } = useAuth();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setInterval(
      () => setResendCooldown((c) => (c <= 1 ? 0 : c - 1)),
      1000
    );
    return () => clearInterval(t);
  }, [resendCooldown]);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email.trim()) {
      setError("Enter your email address.");
      return;
    }
    if (!firstName.trim() || !lastName.trim()) {
      setError("Enter your first and last name.");
      return;
    }
    setSending(true);
    try {
      await sendOtp(email.trim(), "signup");
      setOtpSent(true);
      setResendCooldown(RESEND_COOLDOWN_SECONDS);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to send code. Please try again."
      );
    } finally {
      setSending(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (otp.length < 6) {
      setError("Enter the 6-digit code from your email.");
      return;
    }
    setVerifying(true);
    try {
      const res = await verifyOtp({
        email: email.trim(),
        otp,
        firstName: firstName.trim() || undefined,
        lastName: lastName.trim() || undefined,
      });
      setAuth({ user: res.user });
      router.push("/shop");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Invalid or expired code."
      );
    } finally {
      setVerifying(false);
    }
  };

  const handleResend = async () => {
    setError("");
    setOtp("");
    setSending(true);
    try {
      await sendOtp(email.trim(), "signup");
      setResendCooldown(RESEND_COOLDOWN_SECONDS);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to resend.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex-grow flex flex-col items-center justify-center px-4 py-16 relative min-h-[60vh]">
      <div className="absolute left-[5%] top-[15%] hidden xl:block rotate-[-6deg] z-0 pointer-events-none">
        <div className="bg-white p-3 pb-8 shadow-lg border-2 border-text-chocolate w-48">
          <div className="bg-secondary h-40 w-full flex items-center justify-center overflow-hidden">
            <span className="material-symbols-outlined text-6xl text-text-chocolate/40">
              icecream
            </span>
          </div>
          <div className="hand-font text-center mt-2 text-primary text-lg rotate-1">
            Yum!
          </div>
        </div>
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-24 h-8 bg-accent-mango/80 rotate-2 shadow-sm border border-text-chocolate/30" />
      </div>
      <div className="absolute right-[8%] bottom-[10%] hidden xl:block rotate-[12deg] z-0 pointer-events-none">
        <div className="bg-white p-3 pb-8 shadow-lg border-2 border-text-chocolate w-52">
          <div className="bg-secondary h-44 w-full flex items-center justify-center overflow-hidden">
            <span className="material-symbols-outlined text-6xl text-text-chocolate/40">
              local_pizza
            </span>
          </div>
          <div className="hand-font text-center mt-3 text-primary text-xl -rotate-2">
            Cheezy
          </div>
        </div>
        <div className="absolute -top-3 left-1/3 w-24 h-8 bg-primary/30 -rotate-3 shadow-sm border border-text-chocolate/30" />
      </div>
      <div
        className="absolute left-[15%] bottom-[20%] text-primary/30 animate-bounce hidden lg:block pointer-events-none"
        style={{ animationDuration: "3s" }}
      >
        <span className="material-symbols-outlined text-[64px]">water_drop</span>
      </div>
      <div className="absolute right-[20%] top-[12%] text-accent-mango rotate-45 hidden lg:block pointer-events-none">
        <span className="material-symbols-outlined text-[48px]">star</span>
      </div>
      <div className="absolute left-[10%] top-[30%] text-text-chocolate/20 -rotate-12 hidden lg:block pointer-events-none">
        <span className="material-symbols-outlined text-[80px]">cookie</span>
      </div>

      <div className="relative z-10 w-full max-w-[500px]">
        <div className="text-center mb-8 relative">
          <h1 className="font-product text-5xl md:text-6xl font-black text-text-chocolate uppercase tracking-tight mb-2 relative inline-block">
            Join snacQO
            <span className="absolute -top-6 -right-8 rotate-12">
              <span className="material-symbols-outlined text-4xl text-primary animate-pulse">
                bolt
              </span>
            </span>
          </h1>
          <p className="text-text-chocolate/80 font-body font-bold text-lg mt-2">
            Create an account with email + OTP. No password needed.
          </p>
        </div>

        <div className="relative">
          <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-32 h-10 bg-white/40 backdrop-blur-sm border-l border-r border-white/60 z-30 shadow-sm rotate-2 tape-strip" />
          <div className="absolute -right-6 -top-6 z-30 rotate-[15deg]">
            <div className="bg-accent-mango border-2 border-text-chocolate text-text-chocolate font-black font-product px-4 py-2 rounded-full shadow-[2px_2px_0px_0px_#2D1B0E] uppercase text-sm tracking-wide">
              VIP Snacker
            </div>
          </div>

          <div className="relative z-20 flex flex-col rounded-sm border-[4px] border-text-chocolate bg-white p-8 shadow-[8px_8px_0px_0px_#FF6B6B]">
            {!otpSent ? (
              <form onSubmit={handleSendOtp} className="flex flex-col gap-5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-text-chocolate/60 uppercase tracking-widest font-body">
                      First Name
                    </label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Snack"
                      className="w-full border-[3px] border-text-chocolate bg-background-light p-3 text-lg font-bold text-text-chocolate placeholder:text-text-chocolate/30 focus:border-primary focus:ring-0 focus:outline-none rounded-sm"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-text-chocolate/60 uppercase tracking-widest font-body">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Lover"
                      className="w-full border-[3px] border-text-chocolate bg-background-light p-3 text-lg font-bold text-text-chocolate placeholder:text-text-chocolate/30 focus:border-primary focus:ring-0 focus:outline-none rounded-sm"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-1 relative">
                  <div className="flex justify-between items-end">
                    <label className="block text-xs font-bold text-text-chocolate/60 uppercase tracking-widest font-body">
                      Email Address
                    </label>
                    <span className="hand-font text-primary text-sm transform -rotate-2 hidden sm:block">
                      No spam, just snacks!
                    </span>
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="snacker@example.com"
                    className="w-full border-[3px] border-text-chocolate bg-background-light p-3 text-lg font-bold text-text-chocolate placeholder:text-text-chocolate/30 focus:border-primary focus:ring-0 focus:outline-none rounded-sm pr-10"
                    required
                  />
                  <span className="material-symbols-outlined absolute right-3 top-10 text-text-chocolate/20 -rotate-[30deg] pointer-events-none">
                    nutrition
                  </span>
                </div>
                {error && (
                  <p
                    className="text-accent-strawberry text-sm font-bold"
                    role="alert"
                  >
                    {error}
                  </p>
                )}
                <button
                  type="submit"
                  disabled={sending}
                  className="w-full py-4 border-[3px] border-text-chocolate bg-primary text-lg font-black uppercase tracking-widest text-white shadow-[4px_4px_0px_0px_#2D1B0E] transition-all hover:rotate-1 hover:scale-[1.02] active:rotate-0 active:scale-100 disabled:opacity-70 font-product"
                >
                  {sending ? "Sending…" : "Send Verification Code"}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerify} className="flex flex-col gap-5">
                <p className="text-sm font-bold text-text-chocolate/80">
                  We sent a 6-digit code to{" "}
                  <span className="text-text-chocolate break-all">{email}</span>
                </p>
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-text-chocolate/60 uppercase tracking-widest font-body">
                    Enter code
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={otp}
                    onChange={(e) =>
                      setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                    }
                    placeholder="000000"
                    className="w-full border-[3px] border-text-chocolate bg-background-light p-3 text-2xl font-bold text-text-chocolate text-center tracking-[0.5em] placeholder:text-text-chocolate/30 focus:border-primary focus:ring-0 focus:outline-none rounded-sm"
                    autoComplete="one-time-code"
                  />
                </div>
                {error && (
                  <p
                    className="text-accent-strawberry text-sm font-bold"
                    role="alert"
                  >
                    {error}
                  </p>
                )}
                <p className="text-xs text-text-chocolate/60">
                  Check your email for the code.
                </p>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={sending || resendCooldown > 0}
                    className="flex-1 py-3 bg-white text-text-chocolate font-bold border-[3px] border-text-chocolate rounded-sm hover:bg-secondary transition-colors uppercase text-sm font-product disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {resendCooldown > 0
                      ? `Resend in 0:${String(resendCooldown).padStart(2, "0")}`
                      : "Resend"}
                  </button>
                  <button
                    type="submit"
                    disabled={verifying || otp.length < 6}
                    className="flex-1 py-3 bg-primary text-white font-bold border-[3px] border-text-chocolate rounded-sm shadow-[4px_4px_0px_0px_#2D1B0E] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#2D1B0E] transition-all uppercase font-product disabled:opacity-70"
                  >
                    {verifying ? "Verifying…" : "Create account"}
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => setOtpSent(false)}
                  className="w-full text-sm font-bold text-text-chocolate/70 hover:text-primary transition-colors"
                >
                  ← Use a different email
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm font-bold text-text-chocolate">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-primary underline decoration-[3px] underline-offset-2 hover:text-text-chocolate transition-colors"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
