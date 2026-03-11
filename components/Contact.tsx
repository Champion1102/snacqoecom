"use client";
import { motion } from 'framer-motion';
import { useState } from 'react';

const FORMSPREE_URL = 'https://formspree.io/f/mbdazgra';

export function Contact() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const res = await fetch(FORMSPREE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setStatus('success');
        setEmail('');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    <section className="py-24 px-6 relative overflow-hidden" id="contact">
      <motion.span
        className="absolute top-10 left-10 material-symbols-outlined text-7xl text-primary/30 hidden md:block"
        animate={{ rotate: 360 }}
        transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
      >
        settings
      </motion.span>
      <motion.span
        className="absolute bottom-10 right-10 material-symbols-outlined text-7xl text-accent-mango/30 animate-bounce hidden md:block"
      >
        mail
      </motion.span>

      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div
          className="rounded-none p-8 md:p-16 text-center border-4 border-text-chocolate shadow-sticker-lg relative transform rotate-1 bg-[#FF6B6B]"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <motion.div
            className="absolute -top-6 -right-6 w-24 h-24 bg-secondary rounded-full border-4 border-text-chocolate flex items-center justify-center z-20"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <span className="material-symbols-outlined text-4xl text-text-chocolate">
              notifications_active
            </span>
          </motion.div>

          <h2
            className="text-5xl md:text-7xl font-black text-white mb-6 brand-font uppercase tracking-tight"
            style={{ textShadow: '4px 4px 0px #2D1B0E' }}
          >
            Join The Snac Club
          </h2>
          <p
            className="text-white text-xl md:text-2xl font-bold mb-10 max-w-lg mx-auto leading-tight"
            style={{ textShadow: '1px 1px 0px #2D1B0E' }}
          >
            Get 10% off on your first order + exclusive drops.
          </p>

          {status === 'success' ? (
            <p
              className="text-2xl md:text-3xl font-black text-white brand-font"
              style={{ textShadow: '2px 2px 0px #2D1B0E' }}
            >
              You&apos;re on the list! We&apos;ll hit you up when we drop.
            </p>
          ) : (
            <form
              className="flex flex-col md:flex-row gap-4 max-w-lg mx-auto relative"
              onSubmit={handleSubmit}
            >
              <div className="flex-1 relative flex items-center">
                <span
                  className="absolute left-4 text-text-chocolate/50 pointer-events-none"
                  aria-hidden
                >
                  <span className="material-symbols-outlined text-2xl">mail</span>
                </span>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-14 pr-6 py-5 rounded-none border-4 border-text-chocolate bg-white placeholder-text-chocolate/40 text-text-chocolate font-bold text-lg focus:outline-none focus:ring-0 focus:border-text-chocolate focus:shadow-sticker-sm transition-all"
                  required
                  disabled={status === 'loading'}
                />
              </div>
              <motion.button
                type="submit"
                disabled={status === 'loading'}
                className="px-8 py-5 bg-text-chocolate text-white font-black rounded-none text-xl border-4 border-text-chocolate shadow-[4px_4px_0px_0px_rgba(255,255,255,0.3)] hover:bg-accent-mango hover:text-text-chocolate hover:shadow-sticker-sm hover:-rotate-2 transition-all transform disabled:opacity-70 disabled:cursor-not-allowed"
                whileHover={status === 'loading' ? undefined : { rotate: -2 }}
                whileTap={status === 'loading' ? undefined : { scale: 0.98 }}
              >
                {status === 'loading' ? 'Joining...' : 'JOIN IT'}
              </motion.button>
            </form>
          )}

          {status === 'error' && (
            <p className="mt-4 text-white font-bold">
              Something went wrong. Try again?
            </p>
          )}

          <p className="mt-6 text-sm text-white/80 font-bold uppercase tracking-widest">
            No spam, just snacks.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
