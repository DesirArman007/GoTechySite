import React, { useRef, useState, useMemo } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { Zap, Play, Volume2, VolumeX } from 'lucide-react';
import creator from "../public/assets/creator.png";

export const Hero: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y = useSpring(useTransform(scrollYProgress, [0, 1], [0, 200]), {
    stiffness: 100,
    damping: 30
  });

  const [hovered, setHovered] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [heroContent, setHeroContent] = useState<any>(null);
  const [reelPlaying, setReelPlaying] = useState(false);

  React.useEffect(() => {
    fetch('http://localhost:8080/api/content/latest')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data.latestHero) {
          setHeroContent(data.data.latestHero);
        }
      })
      .catch(err => console.error("Failed to fetch hero content:", err));
  }, []);

  // Generate random particles for the drift effect
  const particles = useMemo(() => {
    return Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: Math.random() * 6 + 2, // 2px to 8px
      duration: Math.random() * 20 + 10, // 10s to 30s
      delay: Math.random() * 5,
      xOffset: Math.random() * 100 - 50,
      yOffset: Math.random() * 100 - 50,
    }));
  }, []);

  return (
    <div ref={containerRef} style={{ position: 'relative' }} className="relative min-h-screen pt-24 flex items-center justify-center overflow-hidden">

      {/* Background Elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-brand-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute top-40 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-pink-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

      {/* Particle Drift Layer */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full bg-brand-400 mix-blend-screen"
            style={{
              left: `${p.left}%`,
              top: `${p.top}%`,
              width: p.size,
              height: p.size,
            }}
            animate={{
              x: [0, p.xOffset, 0],
              y: [0, p.yOffset, 0],
              opacity: [0.1, 0.4, 0.1],
              scale: [1, 1.2, 1]
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

      <div className="max-w-7xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">

        {/* Left Content */}
        <div className="lg:col-span-3 order-2 lg:order-1 text-center lg:text-left space-y-6">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-brand-900 leading-tight">
              GoTechy <br />
            </h1>
            <p className="mt-4 text-gray-600 leading-relaxed text-sm md:text-base">
              Our mission is to help you make confident, informed choices on the latest gadgets, smartphones, and tech essentials in a straightforward style.
            </p>

            <div className="flex flex-wrap gap-5 mt-6 justify-center lg:justify-start">
              {[
                {
                  name: 'YouTube', url: 'https://www.youtube.com/@Go_Techy', color: '#FF0000', icon: (
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>
                  )
                },
                {
                  name: 'Instagram', url: 'https://www.instagram.com/go_techy/', gradient: 'linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)', icon: (
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" /></svg>
                  )
                },
                {
                  name: 'Twitter', url: 'https://x.com/_GoTechy', color: '#1DA1F2', icon: (
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                  )
                },
              ].map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col items-center gap-1"
                >
                  <div
                    className="w-11 h-11 rounded-full border-2 border-red-200 flex items-center justify-center transition-all duration-300 group-hover:scale-125 group-hover:shadow-lg group-hover:border-transparent"
                    style={{
                      color: social.color || '#E1306C',
                      background: 'white',
                    }}
                    onMouseEnter={(e) => {
                      const el = e.currentTarget;
                      el.style.background = social.gradient || social.color || '#E1306C';
                      el.style.color = 'white';
                    }}
                    onMouseLeave={(e) => {
                      const el = e.currentTarget;
                      el.style.background = 'white';
                      el.style.color = social.color || '#E1306C';
                    }}
                  >
                    {social.icon}
                  </div>
                  <span className="text-[9px] font-bold uppercase tracking-wider text-transparent group-hover:text-gray-600 transition-all duration-300">Follow</span>
                </a>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Center Visual (Video/Reel/Image) */}
        <div className="lg:col-span-5 order-1 lg:order-2 flex justify-center relative group">
          <motion.div
            style={{ y }}
            className="relative z-10"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            {/* Abstract circular backdrop */}
            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] md:w-[450px] md:h-[450px] bg-gradient-to-b from-brand-100 to-white rounded-full -z-10 transition-all duration-700 ${hovered ? 'scale-110 opacity-80' : 'scale-100 opacity-50'}`}></div>

            {/* Doodle arrow */}
            <svg className="absolute -top-10 -right-10 w-24 h-24 text-gray-300 hidden md:block" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M10,50 Q30,20 60,10 T90,30" />
              <path d="M80,25 L90,30 L85,40" />
            </svg>

            {/* Doodle sparkle */}
            <svg className="absolute top-20 -left-10 w-16 h-16 text-brand-200 hidden md:block animate-pulse" viewBox="0 0 50 50" fill="currentColor">
              <path d="M25,0 L30,15 L45,20 L30,25 L25,40 L20,25 L5,20 L20,15 Z" />
            </svg>

            {/* Video Container (Reel Style) */}
            <div className="w-[280px] h-[350px] md:w-[320px] md:h-[500px] relative rounded-[40px] shadow-2xl overflow-hidden border-8 border-white transform rotate-2 hover:rotate-0 transition-all duration-500 bg-black" style={{ WebkitMaskImage: '-webkit-radial-gradient(white, black)' }}>
              {heroContent ? (
                heroContent.source === 'youtube' ? (
                  <iframe
                    src={`https://www.youtube.com/embed/${heroContent.platformId}?autoplay=1&mute=${isMuted ? 1 : 0}&controls=0&loop=1&playlist=${heroContent.platformId}&playsinline=1&rel=0`}
                    title={heroContent.title || 'YouTube Video'}
                    className="w-full h-full object-cover"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : heroContent.source === 'instagram' ? (
                  <iframe
                    src={`https://www.instagram.com/reel/${heroContent.platformId}/embed/`}
                    title={heroContent.caption || 'Instagram Reel'}
                    className="w-full h-full border-0"
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                    scrolling="no"
                  />
                ) : (
                  <video
                    src={heroContent.videoUrl || heroContent.mediaUrl}
                    poster={heroContent.thumbnail}
                    autoPlay
                    loop
                    muted={isMuted}
                    playsInline
                    className="w-full h-full object-cover"
                  />
                )
              ) : (
                <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-400">Loading...</div>
              )}

              {/* Overlay Gradient for Text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none"></div>

              {/* Reel UI Elements */}
              <div className="absolute top-4 left-4 bg-black/20 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1.5 text-white/90">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-[10px] font-bold tracking-wide">LATEST</span>
              </div>

              <button
                onClick={() => setIsMuted(!isMuted)}
                className="absolute bottom-4 right-4 w-10 h-10 bg-black/30 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-black/50 transition-colors z-20"
              >
                {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
              </button>
            </div>

            {/* Floating badge */}
            {/* <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="absolute bottom-10 -right-6 md:-right-12 bg-white p-4 rounded-2xl shadow-xl flex items-center gap-3 border border-gray-100 max-w-[200px]"
            >
              <div className="p-2 bg-brand-100 rounded-lg text-brand-600 shrink-0">
                <Zap size={24} fill="currentColor" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-semibold uppercase">Featured</p>
                <p className="font-bold text-gray-900 leading-tight">Pixel 9 Pro XL Review</p>
              </div>
            </motion.div> */}
          </motion.div>
        </div>

        {/* Right Content */}
        <div className="lg:col-span-4 order-3 lg:order-3 text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {/* Creator Avatar above text */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.6, type: "spring" }}
              className="mb-6 relative inline-block lg:block mx-auto lg:mx-0"
            >
              <div className="w-20 h-20 rounded-full p-1 bg-white shadow-lg border border-gray-100">
                <img
                  src={creator}
                  alt="Creator"
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
              <div className="absolute -bottom-2 -right-2 bg-blue-500 text-white p-1.5 rounded-full border-2 border-white">
                <Zap size={12} fill="currentColor" />
              </div>
            </motion.div>

            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 leading-none tracking-tight">
              Helping <br />
              <span className="text-brand-600">Thousands</span> <br />
              Learn Tech <br />
              with <span className="text-orange-500">Us</span>
            </h2>
            <p className="mt-4 text-gray-500 italic font-medium">- Thank you</p>

            <div className="mt-8 relative hidden md:block opacity-20">
              <div className="w-32 h-32 border-4 border-gray-300 rounded-full flex items-center justify-center absolute right-0 top-0 rotate-12">
                <div className="w-2 h-2 bg-gray-300 rounded-full mb-4 mr-4"></div>
                <div className="w-2 h-2 bg-gray-300 rounded-full mb-4 ml-4"></div>
                <div className="w-16 h-4 border-b-4 border-gray-300 rounded-[50%] absolute bottom-8"></div>
              </div>
            </div>
          </motion.div>
        </div>

      </div>
    </div>
  );
};
