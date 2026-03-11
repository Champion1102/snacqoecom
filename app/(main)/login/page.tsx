"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { sendOtp, verifyOtp } from "@/api/auth";

const RESEND_COOLDOWN_SECONDS = 60;

export default function LoginPage() {
  const router = useRouter();
  const { setAuth } = useAuth();
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
    setSending(true);
    try {
      await sendOtp(email.trim(), "login");
      setOtpSent(true);
      setResendCooldown(RESEND_COOLDOWN_SECONDS);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send code.");
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
      const res = await verifyOtp({ email: email.trim(), otp });
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
      await sendOtp(email.trim(), "login");
      setResendCooldown(RESEND_COOLDOWN_SECONDS);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to resend.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div
      className="flex-grow flex items-center justify-center p-4 lg:p-12 relative overflow-hidden min-h-[60vh]"
      style={{
        backgroundColor: "#E8F5E9",
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.08'/%3E%3C/svg%3E")`,
      }}
    >
      <div className="absolute top-32 left-[5%] animate-pulse hidden lg:block pointer-events-none">
        <span className="material-symbols-outlined text-5xl text-primary">
          auto_awesome
        </span>
      </div>
      <div className="absolute bottom-10 left-[20%] hidden lg:block rotate-12 pointer-events-none">
        <span className="material-symbols-outlined text-6xl text-accent-mango">
          eco
        </span>
      </div>
      <div className="absolute top-40 right-[10%] hidden lg:block -rotate-12 opacity-80 pointer-events-none">
        <span className="material-symbols-outlined text-7xl text-primary">
          favorite
        </span>
      </div>

      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full max-w-6xl relative z-10">
        <div className="hidden lg:flex flex-col items-center justify-center relative min-h-[400px]">
          <div className="relative rotate-[-6deg] hover:rotate-0 transition-transform duration-500 ease-out cursor-default">
            <h1 className="font-product text-[180px] leading-[0.8] text-accent-mango font-black drop-shadow-[8px_8px_0px_#2D1B0E] select-none">
              snac
              <br />
              <span className="text-primary">QO</span>
            </h1>
            <div className="absolute -top-10 -right-10 rotate-12 bg-white border-4 border-text-chocolate px-4 py-2 shadow-[4px_4px_0px_0px_#2D1B0E]">
              <span className="font-product font-bold text-xl uppercase">
                High Vibe!
              </span>
            </div>
          </div>
        </div>

        <div className="flex justify-center lg:justify-start w-full">
          <div className="relative w-full max-w-[480px] -rotate-2 hover:rotate-0 transition-transform duration-300">
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-30 w-32 h-10 tape-strip flex items-center justify-center border-l border-r border-white/40">
              <span className="font-product text-xs font-bold text-text-chocolate/50 uppercase tracking-widest opacity-60">
                snacQO TAPE
              </span>
            </div>
            <div className="bg-white border-4 border-text-chocolate shadow-[12px_12px_0px_0px_#FF9F1C] p-8 sm:p-12 relative z-10 flex flex-col items-center text-center">
              <div className="mb-8 w-full">
                <h1 className="text-text-chocolate text-5xl sm:text-6xl font-product font-bold uppercase leading-[0.9] mb-3 tracking-tighter">
                  Welcome
                  <br />
                  <span className="text-accent-mango drop-shadow-[2px_2px_0px_#2D1B0E]">
                    Back
                  </span>
                </h1>
                <p className="text-text-chocolate font-body font-bold text-lg max-w-xs mx-auto leading-tight mt-4">
                  Enter your email and we&apos;ll send a code to log in.
                </p>
              </div>

              {!otpSent ? (
                <form
                  onSubmit={handleSendOtp}
                  className="w-full flex flex-col gap-6"
                >
                  <label className="flex flex-col w-full text-left group">
                    <span className="text-text-chocolate font-product text-sm font-bold uppercase tracking-wider mb-2 ml-1">
                      Email Address
                    </span>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="snacker@example.com"
                      className="w-full h-14 bg-background-light border-[3px] border-text-chocolate rounded-md px-4 text-xl font-bold font-product text-text-chocolate placeholder:text-text-chocolate/30 focus:outline-none focus:ring-4 focus:ring-primary/30 focus:border-text-chocolate transition-shadow shadow-[4px_4px_0px_0px_rgba(45,27,14,0.1)] focus:shadow-none"
                      required
                    />
                  </label>
                  {error && (
                    <p
                      className="text-accent-strawberry text-sm font-bold text-left"
                      role="alert"
                    >
                      {error}
                    </p>
                  )}
                  <button
                    type="submit"
                    disabled={sending}
                    className="w-full h-16 bg-primary border-[3px] border-text-chocolate rounded-md text-white text-xl font-product font-black uppercase tracking-wide shadow-[5px_5px_0px_0px_#3D2314] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#3D2314] active:translate-y-[5px] active:shadow-none transition-all duration-150 disabled:opacity-70"
                  >
                    {sending ? "Sending…" : "Send Login Code"}
                  </button>
                </form>
              ) : (
                <form
                  onSubmit={handleVerify}
                  className="w-full flex flex-col gap-6"
                >
                  <p className="text-sm font-bold text-text-chocolate/80 text-left">
                    We sent a 6-digit code to{" "}
                    <span className="text-text-chocolate break-all">{email}</span>
                  </p>
                  <label className="flex flex-col w-full text-left">
                    <span className="text-text-chocolate font-product text-sm font-bold uppercase tracking-wider mb-2 ml-1">
                      Enter code
                    </span>
                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      value={otp}
                      onChange={(e) =>
                        setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                      }
                      placeholder="000000"
                      className="w-full h-14 bg-background-light border-[3px] border-text-chocolate rounded-md px-4 text-2xl font-bold font-product text-text-chocolate text-center tracking-[0.5em] placeholder:text-text-chocolate/30 focus:outline-none focus:ring-4 focus:ring-primary/30"
                      autoComplete="one-time-code"
                    />
                  </label>
                  {error && (
                    <p
                      className="text-accent-strawberry text-sm font-bold text-left"
                      role="alert"
                    >
                      {error}
                    </p>
                  )}
                  <p className="text-xs text-text-chocolate/60 text-left">
                    Check your email for the code.
                  </p>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={handleResend}
                      disabled={sending || resendCooldown > 0}
                      className="flex-1 py-3 bg-white text-text-chocolate font-bold border-[3px] border-text-chocolate rounded-md hover:bg-secondary transition-colors uppercase tracking-wider text-sm font-product disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {resendCooldown > 0
                        ? `Resend in 0:${String(resendCooldown).padStart(2, "0")}`
                        : "Resend"}
                    </button>
                    <button
                      type="submit"
                      disabled={verifying || otp.length < 6}
                      className="flex-1 py-3 h-14 bg-primary text-white font-bold border-[3px] border-text-chocolate rounded-md shadow-[4px_4px_0px_0px_#2D1B0E] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#2D1B0E] transition-all uppercase font-product disabled:opacity-70"
                    >
                      {verifying ? "Verifying…" : "Log in"}
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

              <div className="mt-8 pt-6 border-t-2 border-dashed border-text-chocolate/20 w-full">
                <p className="text-sm font-bold text-text-chocolate">
                  New here?{" "}
                  <Link
                    href="/signup"
                    className="text-primary underline decoration-[3px] underline-offset-2 hover:text-text-chocolate transition-colors"
                  >
                    Create an account
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
