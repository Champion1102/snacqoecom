"use client";
import { useState, useEffect } from 'react';
import { sendOtp, verifyOtp } from '@/api/auth';
import { useAuth } from '@/contexts/AuthContext';

const RESEND_COOLDOWN_SECONDS = 60;

interface EmailVerificationModalProps {
  email: string;
  /** Optional: for new users, these will be stored on the account */
  firstName?: string;
  lastName?: string;
  onVerify: () => void;
  onClose: () => void;
}

export function EmailVerificationModal({ email, firstName, lastName, onVerify, onClose }: EmailVerificationModalProps) {
  const { setAuth } = useAuth();
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setInterval(() => setResendCooldown((c) => (c <= 1 ? 0 : c - 1)), 1000);
    return () => clearInterval(t);
  }, [resendCooldown]);

  const handleSendOtp = async () => {
    setError('');
    setSending(true);
    try {
      await sendOtp(email.trim());
      setOtpSent(true);
      setResendCooldown(RESEND_COOLDOWN_SECONDS);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send code. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const handleVerify = async () => {
    setError('');
    if (otp.length < 6) {
      setError('Enter the 6-digit code from your email.');
      return;
    }
    setVerifying(true);
    try {
      const res = await verifyOtp({
        email: email.trim(),
        otp,
        ...(firstName !== undefined && { firstName: firstName.trim() }),
        ...(lastName !== undefined && { lastName: lastName.trim() }),
      });
      setAuth({ user: res.user });
      onVerify();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid or expired code. Try again.');
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-text-chocolate/60 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="email-verification-title"
    >
      <div
        className="relative w-full max-w-md bg-white border-4 border-text-chocolate shadow-[8px_8px_0px_0px_#E0F7FA] p-6 md:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="absolute -top-3 left-1/2 -translate-x-1/2 w-28 h-6 tape-strip rotate-2"
          aria-hidden
        />
        <div className="flex items-center justify-between mb-6">
          <h2
            id="email-verification-title"
            className="text-2xl md:text-3xl text-text-chocolate brand-font uppercase tracking-tight"
            style={{ textShadow: '2px 2px 0px #E0F7FA' }}
          >
            Verify your email
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 border-2 border-text-chocolate text-text-chocolate hover:bg-text-chocolate hover:text-white transition-colors rounded-sm"
            aria-label="Close"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        <p className="text-sm font-bold text-text-chocolate/80 mb-4">
          We&apos;ll send a one-time code to this address:
        </p>
        <div className="mb-6 p-4 bg-secondary/50 border-2 border-text-chocolate font-bold text-text-chocolate break-all">
          {email}
        </div>

        {!otpSent ? (
          <button
            type="button"
            onClick={handleSendOtp}
            disabled={sending}
            className="w-full py-3 bg-accent-mango text-text-chocolate font-bold border-2 border-text-chocolate shadow-[4px_4px_0px_0px_#2D1B0E] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#2D1B0E] transition-all uppercase tracking-wider btn-text disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {sending ? 'Sending…' : 'Send verification code'}
          </button>
        ) : (
          <>
            <label
              htmlFor="otp-input"
              className="block text-xs font-bold uppercase text-text-chocolate/70 mb-2"
            >
              Enter 6-digit code
            </label>
            <input
              id="otp-input"
              type="text"
              inputMode="numeric"
              maxLength={6}
              placeholder="000000"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              className="input-snacqo text-center text-2xl tracking-[0.5em] mb-4"
              autoComplete="one-time-code"
            />
            {error && (
              <p className="text-accent-strawberry text-sm font-bold mb-3" role="alert">
                {error}
              </p>
            )}
            <p className="text-xs text-text-chocolate/60 mb-4">
              Check your email for the code.
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleSendOtp}
                disabled={sending || resendCooldown > 0}
                className="flex-1 py-3 bg-white text-text-chocolate font-bold border-2 border-text-chocolate hover:bg-secondary transition-colors uppercase tracking-wider text-sm btn-text disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {resendCooldown > 0 ? `Resend in 0:${String(resendCooldown).padStart(2, '0')}` : 'Resend'}
              </button>
              <button
                type="button"
                onClick={handleVerify}
                disabled={verifying || otp.length < 6}
                className="flex-1 py-3 bg-primary text-white font-bold border-2 border-text-chocolate shadow-[4px_4px_0px_0px_#2D1B0E] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all uppercase tracking-wider btn-text disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {verifying ? 'Verifying…' : 'Verify'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
