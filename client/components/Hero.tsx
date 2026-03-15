import { useRef, useMemo, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import creator from "../public/assets/creator.png";
import goTechyLogo from "../public/assets/go_techy_logo.png";

// ── Count-up hook ──
const useCountUp = (end: number, duration = 2000, delay = 600) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      let startTime: number | null = null;
      const step = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        // ease-out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        setCount(Math.floor(eased * end));
        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          setCount(end);
        }
      };
      requestAnimationFrame(step);
    }, delay);
    return () => clearTimeout(timeout);
  }, [end, duration, delay]);

  return count;
};

// ── Stat with rolling number ──
const CountUpStat: React.FC<{ end: number; decimals?: number; suffix: string; label: string; sublabel?: string }> = ({ end, decimals = 0, suffix, label, sublabel }) => {
  const count = useCountUp(decimals > 0 ? Math.round(end * 100) : end, 2000, 800);
  const display = decimals > 0 ? (count / 100).toFixed(decimals) : count.toString();
  return (
    <div className="text-center px-2">
      <p className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight tabular-nums">
        {display}{suffix}
      </p>
      <p className="text-[10px] sm:text-xs text-blue-100 font-semibold mt-1">{label}</p>
      {sublabel && <p className="text-[9px] sm:text-[10px] text-blue-200 font-medium">{sublabel}</p>}
    </div>
  );
};

export const Hero = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y = useSpring(useTransform(scrollYProgress, [0, 1], [0, 150]), {
    stiffness: 100,
    damping: 30
  });

  const particles = useMemo(() => {
    return Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: Math.random() * 5 + 2,
      duration: Math.random() * 20 + 12,
      delay: Math.random() * 5,
      xOffset: Math.random() * 80 - 40,
      yOffset: Math.random() * 80 - 40,
    }));
  }, []);

  const stats = [
    { end: 2.08, decimals: 2, suffix: 'L+', label: 'Total Followers' },
    { end: 85, decimals: 0, suffix: 'M+', label: 'Total Views', sublabel: 'Across YouTube & Instagram' },
    { end: 944, decimals: 0, suffix: '+', label: 'Total Content Pieces', sublabel: 'YouTube + Instagram' },
  ];

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{ paddingTop: '5rem', paddingBottom: '3rem' }}
    >
      {/* ── Background layers ── */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Gradient orbs */}
        <div className="absolute top-10 -left-32 w-[600px] h-[600px] bg-brand-200 rounded-full mix-blend-multiply filter blur-[140px] opacity-30 animate-blob" />
        <div className="absolute top-60 -right-24 w-[500px] h-[500px] bg-purple-200 rounded-full mix-blend-multiply filter blur-[120px] opacity-25 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-32 left-1/4 w-[450px] h-[450px] bg-pink-100 rounded-full mix-blend-multiply filter blur-[120px] opacity-20 animate-blob animation-delay-4000" />
        <div className="absolute top-1/2 right-1/3 w-[300px] h-[300px] bg-amber-100 rounded-full mix-blend-multiply filter blur-[100px] opacity-15 animate-blob animation-delay-2000" />

        {/* Radial spotlights */}
        <div
          className="absolute inset-0 opacity-50"
          style={{
            background: 'radial-gradient(ellipse 60% 50% at 25% 35%, rgba(59,130,246,0.07), transparent), radial-gradient(ellipse 50% 40% at 75% 60%, rgba(139,92,246,0.05), transparent)',
          }}
        />

        {/* Dot grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'radial-gradient(circle, #3b82f6 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />

        {/* Decorative rings (behind creator image area) */}
        <div className="absolute right-[5%] top-[15%] w-[500px] h-[500px] hidden lg:block pointer-events-none">
          <div className="absolute inset-0 rounded-full border border-brand-100/30" />
          <div className="absolute inset-8 rounded-full border border-brand-100/20" />
          <div className="absolute inset-16 rounded-full border border-purple-100/15" />
        </div>

        {/* Top accent gradient line */}
        <div
          className="absolute top-0 left-0 right-0 h-[3px]"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, #3b82f6 20%, #8b5cf6 50%, #ec4899 80%, transparent 100%)',
            opacity: 0.4,
          }}
        />
      </div>

      {/* Particle drift */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full bg-brand-400 mix-blend-screen"
            style={{ left: `${p.left}%`, top: `${p.top}%`, width: p.size, height: p.size }}
            animate={{
              x: [0, p.xOffset, 0],
              y: [0, p.yOffset, 0],
              opacity: [0.08, 0.3, 0.08],
              scale: [1, 1.3, 1],
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              ease: "easeInOut",
              delay: p.delay,
            }}
          />
        ))}
      </div>

      {/* ── Main content ── */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">

        {/* ─── LEFT column : Text + CTAs + Stats ─── */}
        <div className="order-2 lg:order-1 text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
          >
            {/* Pill badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15, duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-50 border border-brand-200 mb-8"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500" />
              </span>
              <span className="text-xs font-semibold text-brand-700 tracking-wide uppercase">India's Trusted Tech Channel</span>
            </motion.div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-[1.1] tracking-tight">
              Your Go-To Source <br className="hidden sm:block" />
              for <span className="bg-gradient-to-r from-brand-600 to-brand-500 bg-clip-text text-transparent">Honest</span> <br className="hidden sm:block" />
              <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">Tech Reviews</span>
            </h1>

            {/* Subheading */}
            <p className="mt-5 text-gray-500 text-base sm:text-lg leading-relaxed max-w-xl mx-auto lg:mx-0">
              Making confident, informed choices on the latest gadgets, smartphones &amp; tech essentials — in a straightforward style.
            </p>

            {/* CTA buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.6 }}
              className="mt-8 flex flex-wrap gap-4 justify-center lg:justify-start"
            >
              <a
                href="https://www.youtube.com/@Go_Techy"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full font-semibold text-sm border-2 border-gray-200 text-gray-700 hover:border-red-400 hover:text-red-600 hover:bg-red-50 transition-all duration-300 hover:-translate-y-0.5"
              >
                <svg viewBox="0 0 24 24" fill="#FF0000" className="w-5 h-5 shrink-0"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>
                Follow on YouTube
              </a>
              <a
                href="https://www.instagram.com/go_techy/"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full font-semibold text-sm border-2 border-gray-200 text-gray-700 hover:border-brand-300 hover:text-brand-700 hover:bg-brand-50 transition-all duration-300 hover:-translate-y-0.5"
              >
                <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] shrink-0"><defs><linearGradient id="ig-hero" x1="0%" y1="100%" x2="100%" y2="0%"><stop offset="0%" stopColor="#f09433" /><stop offset="50%" stopColor="#dc2743" /><stop offset="100%" stopColor="#bc1888" /></linearGradient></defs><path fill="url(#ig-hero)" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" /></svg>
                Follow on Instagram
              </a>
            </motion.div>

            {/* Stats bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, duration: 0.6 }}
              className="mt-10 w-full max-w-lg mx-auto lg:mx-0 rounded-2xl overflow-hidden shadow-xl"
              style={{
                background: 'linear-gradient(135deg, #6366f1 0%, #3b82f6 40%, #2563eb 100%)',
              }}
            >
              <div className="grid grid-cols-3 divide-x divide-white/20 px-3 py-5 sm:px-5 sm:py-6">
                {stats.map((s, i) => (
                  <CountUpStat key={i} end={s.end} decimals={s.decimals} suffix={s.suffix} label={s.label} sublabel={s.sublabel} />
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* ─── RIGHT column : Creator visual ─── */}
        <div className="order-1 lg:order-2 flex justify-center lg:justify-end relative">
          <motion.div
            style={{ y }}
            className="relative"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
          >
            {/* Outer glow ring */}
            <div className="absolute inset-0 -m-6 rounded-full bg-gradient-to-br from-brand-200/40 via-transparent to-purple-200/30 blur-2xl" />

            {/* Creator image container */}
            <div className="relative w-[280px] h-[280px] sm:w-[340px] sm:h-[340px] lg:w-[400px] lg:h-[400px]">
              {/* Decorative ring */}
              <div className="absolute inset-0 rounded-full border-2 border-dashed border-brand-200/50 animate-[spin_30s_linear_infinite]" />
              <div className="absolute inset-3 rounded-full border border-brand-100/40" />

              {/* Main image */}
              <div className="absolute inset-6 rounded-full overflow-hidden shadow-2xl shadow-brand-500/10 ring-4 ring-white">
                <img
                  src={creator}
                  alt="GoTechy Creator"
                  className="w-full h-full object-cover"
                />
                {/* Subtle overlay shimmer */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-white/5" />
              </div>

              {/* ── Floating channel badge (YouTube) ── */}
              <motion.a
                href="https://www.youtube.com/@Go_Techy"
                target="_blank"
                rel="noopener noreferrer"
                animate={{ y: [0, -8, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                className="absolute -left-4 sm:-left-6 top-1/4 flex items-center gap-2.5 bg-white/90 backdrop-blur-md pl-2 pr-4 py-2 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow"
              >
                <div className="w-10 h-10 rounded-full overflow-hidden shadow-sm shrink-0">
                  <img src={goTechyLogo} alt="GoTechy" className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="flex items-center gap-1 text-xs font-bold text-gray-800">
                    <svg viewBox="0 0 24 24" fill="#FF0000" className="w-3.5 h-3.5 shrink-0"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>
                    GoTechy
                  </p>
                  <p className="text-[10px] text-gray-500 font-medium">97.5K Subscribers</p>
                </div>
              </motion.a>

              {/* ── Floating channel badge (Instagram) ── */}
              <motion.a
                href="https://www.instagram.com/go_techy/"
                target="_blank"
                rel="noopener noreferrer"
                animate={{ y: [0, 8, 0] }}
                transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
                className="absolute -right-4 sm:-right-6 bottom-1/4 flex items-center gap-2.5 bg-white/90 backdrop-blur-md pl-2 pr-4 py-2 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow"
              >
                <div className="w-10 h-10 rounded-full overflow-hidden shadow-sm shrink-0">
                  <img src={creator} alt="Go_techy" className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="flex items-center gap-1 text-xs font-bold text-gray-800">
                    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 shrink-0"><defs><linearGradient id="ig-badge" x1="0%" y1="100%" x2="100%" y2="0%"><stop offset="0%" stopColor="#f09433" /><stop offset="50%" stopColor="#dc2743" /><stop offset="100%" stopColor="#bc1888" /></linearGradient></defs><path fill="url(#ig-badge)" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" /></svg>
                    Go_techy
                  </p>
                  <p className="text-[10px] text-gray-500 font-medium">111K Followers</p>
                </div>
              </motion.a>

              {/* ── Floating X / Twitter badge ── */}
              <motion.a
                href="https://x.com/_GoTechy"
                target="_blank"
                rel="noopener noreferrer"
                animate={{ y: [0, -6, 0] }}
                transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut", delay: 2 }}
                className="absolute right-4 -top-2 flex items-center gap-2 bg-white/90 backdrop-blur-md px-3 py-2 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow"
              >
                <svg viewBox="0 0 24 24" fill="#000" className="w-4 h-4"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                <span className="text-xs font-bold text-gray-800">@_GoTechy</span>
              </motion.a>
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
};
