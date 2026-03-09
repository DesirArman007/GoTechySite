import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, UserCheck, Star } from 'lucide-react';
import { StatItem } from '../types';
import logo from "../public/assets/go_techy_logo.png";
import creator from "../public/assets/creator.png";

const stats: StatItem[] = [
  { value: '2.08L+', label: 'Total followers' },
  { value: '85M+', label: 'Total Views', subLabel: 'Across YouTube & Instagram' },
  { value: '944+', label: 'Total Content Pieces', subLabel: 'YouTube + Instagram' },

];

export const StatsBar: React.FC = () => {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-6 -mt-12 relative z-20">
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="w-full rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row min-h-[180px]"
      >
        {/* Left Side: Stats (Blue Gradient) */}
        <div className="md:w-7/12 bg-gradient-to-r from-brand-500 to-brand-400 p-8 md:p-10 flex flex-col md:flex-row items-center justify-around text-white relative overflow-hidden">

          {/* Background texture for stats */}
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path d="M0,0 L100,0 L100,100 Z" fill="white" />
            </svg>
          </div>

          {stats.map((stat, idx) => (
            <div key={idx} className="text-center relative z-10 py-4 md:py-0 border-b md:border-b-0 border-white/20 last:border-0 w-full md:w-auto">
              <h3 className="text-3xl md:text-4xl font-bold mb-1">{stat.value}</h3>
              <p className="text-brand-50 text-sm md:text-base font-medium">{stat.label}</p>
              {stat.subLabel && <p className="text-white font-bold text-sm mt-1">{stat.subLabel}</p>}
            </div>
          ))}
        </div>

        {/* Right Side: Founder Info (Light Gray) */}
        <div className="md:w-5/12 bg-gray-100 p-8 md:p-10 flex flex-col justify-center relative">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            I'm Founder of
            <span className="h-px bg-gray-400 flex-grow ml-4"></span>
            <ArrowRightIcon className="text-gray-400" />
          </h3>

          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3">
              <img src={logo} className="w-12 h-12 rounded-full border-2 border-white shadow-md" alt="Avatar" />
              <div>
                <p className="font-bold text-gray-900 text-sm flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-red-600 shrink-0" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>
                  GoTechy
                </p>
                <p className="text-xs text-gray-500">97.5K Subscribers</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <img src={creator} className="w-12 h-12 rounded-full border-2 border-white shadow-md" alt="Avatar" />
              <div>
                <p className="font-bold text-gray-900 text-sm flex items-center gap-1.5">
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="url(#insta-gradient)"><defs><linearGradient id="insta-gradient" x1="0%" y1="100%" x2="100%" y2="0%"><stop offset="0%" stopColor="#feda75" /><stop offset="20%" stopColor="#fa7e1e" /><stop offset="40%" stopColor="#d62976" /><stop offset="60%" stopColor="#962fbf" /><stop offset="100%" stopColor="#4f5bd5" /></linearGradient></defs><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" /></svg>
                  Go_techy
                </p>
                <p className="text-xs text-gray-500">111K Followers</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const ArrowRightIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </svg>
);
